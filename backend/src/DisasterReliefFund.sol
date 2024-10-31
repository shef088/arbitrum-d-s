// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DisasterReliefFund {
    struct Proposal {
        address proposer;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        uint256 fundsReceived; // Track funds received specifically for this proposal
        bool executed;
        bool archived;
        bool passed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Tracks if a user has voted on a proposal
    mapping(uint256 => mapping(address => bool)) public userVote; // Tracks the user's vote (true for 'for', false for 'against')
    mapping(address => uint256[]) public userProposals; // Maps user address to an array of proposal IDs
    mapping(uint256 => mapping(address => uint256)) public donations; // Tracks individual donations to each proposal

    uint256 public proposalCount;
    uint256 public totalPot; // Shared pool for all donations

    event ProposalCreated(uint256 proposalId, string title, string description);
    event Voted(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId, bool passed);
    event ProposalRecreated(uint256 originalProposalId, uint256 newProposalId);
    event DonationReceived(uint256 proposalId, address donor, uint256 amount);
    event FundsAllocated(uint256 amount, address recipient);

    function createProposal(string memory _title, string memory _description) public returns (uint256) {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            proposer: msg.sender,
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + 1 days,
            fundsReceived: 0,
            executed: false,
            archived: false,
            passed: false
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
       // require(msg.value >= 0.00001 ether, "Donation must be greater than 0.00 ETH");

        proposals[_proposalId].fundsReceived += msg.value; // Track funds received for each proposal
        donations[_proposalId][msg.sender] += msg.value;   // Track individual contributions
        totalPot += msg.value; // Add to the shared donation pool

        emit DonationReceived(_proposalId, msg.sender, msg.value);
    }

    function vote(uint256 _proposalId, bool _support) public {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        require(!proposals[_proposalId].archived, "Proposal is archived");
        require(block.timestamp < proposals[_proposalId].deadline, "Voting period has ended");

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
        require(block.timestamp >= proposals[_proposalId].deadline, "Voting period not ended");
        require(!proposals[_proposalId].executed, "Already executed");

        Proposal storage proposal = proposals[_proposalId];
        bool passed = proposal.votesFor > proposal.votesAgainst;
        proposal.executed = true;
        proposal.archived = true;
        proposal.passed = passed;

        if (passed) {
            uint256 allocation = proposal.fundsReceived; // Use funds donated specifically to this proposal
            totalPot -= allocation;
            payable(proposal.proposer).transfer(allocation); // Transfer to proposer
        }

        emit ProposalExecuted(_proposalId, passed);
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
            deadline: block.timestamp + 1 days,
            fundsReceived: 0,
            executed: false,
            archived: false,
            passed: false
        });

        userProposals[msg.sender].push(proposalCount);

        emit ProposalRecreated(_originalProposalId, proposalCount);
        emit ProposalCreated(proposalCount, originalProposal.title, originalProposal.description);
    }

    function checkExpiredProposals() public {
        for (uint256 i = 1; i <= proposalCount; i++) {
            Proposal storage proposal = proposals[i];
            if (!proposal.executed && block.timestamp >= proposal.deadline) {
                executeProposal(i);
            }
        }
    }

    function getProposal(uint256 _proposalId) public view returns (Proposal memory) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        return proposals[_proposalId];
    }

    function getProposalCount() public view returns (uint256) {
        return proposalCount;
    }

    // Function to allocate funds from the total pot based on governance
    function allocateFromPot(uint256 amount, address recipient) public {
        // Add governance checks to ensure only approved allocations can be made
        require(amount <= totalPot, "Insufficient funds in the pot");
        totalPot -= amount;
        payable(recipient).transfer(amount);

        emit FundsAllocated(amount, recipient);
    }
}
