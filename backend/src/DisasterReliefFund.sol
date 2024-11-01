// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DisasterReliefFund {
    struct Donation {
        uint256 amount;
        uint256 proposalId;
    }

    struct Proposal {
        address proposer;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool votingPassed;  
        uint256 votingDeadline;  
        uint256 fundsReceived; // Track funds received specifically for this proposal
        bool executed;
        bool archived;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Tracks if a user has voted on a proposal
    mapping(uint256 => mapping(address => bool)) public userVote; // Tracks the user's vote (true for 'for', false for 'against')
    mapping(address => uint256[]) public userProposals; // Maps user address to an array of proposal IDs
    mapping(uint256 => mapping(address => uint256)) public donations; // Tracks individual donations to each proposal
    mapping(address => Donation[]) public userDonations; // New mapping to track all donations made by each user with proposal ID

    mapping(address => bool) public authorizedGovernance; // Mapping to track authorized governance addresses
    address public owner; // Owner of the contract
    address[] public governanceAddresses; // Array to store governance addresses

    uint256 public proposalCount;
    uint256 public totalPot; // Shared pool for all donations

    event ProposalCreated(uint256 proposalId, string title, string description);
    event Voted(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId, bool votingPassed);  
    event ProposalRecreated(uint256 originalProposalId, uint256 newProposalId);
    event DonationReceived(uint256 proposalId, address donor, uint256 amount);
    event FundsAllocated(uint256 amount, address recipient);

    modifier onlyGovernance() {
        require(authorizedGovernance[msg.sender], "Caller is not authorized governance");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    function createProposal(string memory _title, string memory _description, uint256 _votingDeadline) public returns (uint256) {
        require(_votingDeadline > block.timestamp, "Voting deadline must be in the future"); // Ensure the voting deadline is in the future

        proposalCount++;
        proposals[proposalCount] = Proposal({
            proposer: msg.sender,
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            votingDeadline: _votingDeadline, // Set the voting deadline
            fundsReceived: 0,
            executed: false,
            archived: false,
            votingPassed: false  
        });

        // Add proposal ID to the userProposals mapping for the proposer
        userProposals[msg.sender].push(proposalCount);

        emit ProposalCreated(proposalCount, _title, _description);

        return proposalCount; // Return the proposal ID
    }

    function getUserProposals(address _user) public view returns (uint256[] memory) {
        return userProposals[_user];
    }
    
    function donateToProposal(uint256 _proposalId) public payable {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        require(!proposals[_proposalId].archived, "Proposal is archived");
        require(msg.value >= 0.00001 ether, "Donation must be greater than 0.00 ETH");

        proposals[_proposalId].fundsReceived += msg.value; // Track funds received for each proposal
        donations[_proposalId][msg.sender] += msg.value;   // Track individual contributions
        totalPot += msg.value; // Add to the shared donation pool

        // Track all donations made by the user with the corresponding proposal ID
        userDonations[msg.sender].push(Donation({
            amount: msg.value,
            proposalId: _proposalId
        }));

        emit DonationReceived(_proposalId, msg.sender, msg.value);
    }

    function getUserDonations(address _user) public view returns (Donation[] memory) {
        return userDonations[_user];
    }

    function vote(uint256 _proposalId, bool _support) public {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        require(!proposals[_proposalId].archived, "Proposal is archived");
        require(block.timestamp < proposals[_proposalId].votingDeadline, "Voting period has ended"); // Updated to use votingDeadline

        bool previousVote = userVote[_proposalId][msg.sender];

        if (hasVoted[_proposalId][msg.sender]) {
            if (previousVote == _support) {
                revert("Already voted with this choice for this proposal.");
            } else {
                if (_support) {
                    proposals[_proposalId].votesFor++;
                    proposals[_proposalId].votesAgainst--;
                } else {
                    proposals[_proposalId].votesFor--;
                    proposals[_proposalId].votesAgainst++;
                }
            }
        } else {
            hasVoted[_proposalId][msg.sender] = true;

            if (_support) {
                proposals[_proposalId].votesFor++;
            } else {
                proposals[_proposalId].votesAgainst++;
            }
        }

        userVote[_proposalId][msg.sender] = _support;

        emit Voted(_proposalId, msg.sender, _support);
    }

    function executeProposal(uint256 _proposalId) public {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        require(!proposals[_proposalId].archived, "Proposal is archived");
        require(block.timestamp >= proposals[_proposalId].votingDeadline, "Voting period not ended"); // Updated to use votingDeadline
        require(!proposals[_proposalId].executed, "Already executed");

        Proposal storage proposal = proposals[_proposalId];
        bool votingPassed = proposal.votesFor >= proposal.votesAgainst;  
        proposal.executed = true;
        proposal.votingPassed = votingPassed;

        emit ProposalExecuted(_proposalId, votingPassed);
    }

    function recreateProposal(uint256 _originalProposalId) public {
        require(_originalProposalId > 0 && _originalProposalId <= proposalCount, "Proposal does not exist");
        Proposal memory originalProposal = proposals[_originalProposalId];
        require(originalProposal.archived, "Proposal must be archived first");
        require(msg.sender == originalProposal.proposer, "Only proposer can recreate");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            proposer: msg.sender,
            title: originalProposal.title,
            description: originalProposal.description,
            votesFor: 0,
            votesAgainst: 0,
            votingDeadline: block.timestamp + 1 days, // Default voting deadline for recreated proposals
            fundsReceived: 0,
            executed: false,
            archived: false,
            votingPassed: false  
        });

        userProposals[msg.sender].push(proposalCount);

        emit ProposalRecreated(_originalProposalId, proposalCount);
        emit ProposalCreated(proposalCount, originalProposal.title, originalProposal.description);
    }

    function checkExpiredProposals() public {
        for (uint256 i = 1; i <= proposalCount; i++) {
            Proposal storage proposal = proposals[i];
            if (!proposal.executed && block.timestamp >= proposal.votingDeadline) {
                executeProposal(i);
            }
        }
    }

    function getProposal(uint256 _proposalId) public view returns (Proposal memory) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        return proposals[_proposalId];
    }

    // Function to allocate funds from the total pot based on governance
    function allocateFromPot(uint256 amount, address recipient) public onlyGovernance {
        // Ensure only approved allocations can be made
        require(amount <= totalPot, "Insufficient funds in the pot");
        totalPot -= amount;
        payable(recipient).transfer(amount);

        emit FundsAllocated(amount, recipient);
    }

    function allocateFundsToProposer(uint256 _proposalId) public onlyGovernance {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.executed, "Proposal must be executed before funds can be allocated");
        require(proposal.votingPassed, "Proposal must have passed to allocate funds");
        require(proposal.fundsReceived > 0, "No funds available for allocation");

        uint256 allocation = proposal.fundsReceived; // Use funds donated specifically to this proposal
        totalPot -= allocation; // Decrease the total pot
        payable(proposal.proposer).transfer(allocation); // Transfer to proposer

        proposal.fundsReceived = 0; // Reset funds received for the proposal after allocation
        emit FundsAllocated(allocation, proposal.proposer);
    }

    function archiveProposal(uint256 _proposalId) public {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        require(msg.sender == proposals[_proposalId].proposer, "Only proposer can archive");
        proposals[_proposalId].archived = true;
    }

    // Authorize governance address
    function authorizeGovernance(address _governanceAddress) public onlyOwner {
        require(!authorizedGovernance[_governanceAddress], "Already authorized");
        authorizedGovernance[_governanceAddress] = true;
        governanceAddresses.push(_governanceAddress); // Add to the array of governance addresses
    }

    // Function to retrieve all governance addresses
    function getGovernanceAddresses() public view returns (address[] memory) {
        return governanceAddresses;
    }

    // Function to revoke governance access
    function revokeGovernance(address _governanceAddress) public onlyOwner {
        require(authorizedGovernance[_governanceAddress], "Not an authorized governance address");
        authorizedGovernance[_governanceAddress] = false;
        
        // Remove address from the array (optional; requires additional logic)
    }
}
