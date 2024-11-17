// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DisasterReliefFund {
    struct Donation {
        uint128 amount; // Use uint128 to save space
        uint256 proposalId;
        uint64 timestamp;
    }

    struct Withdrawal {
        uint128 amount; // Use uint128 to save space
        uint256 proposalId;
        uint64 timestamp;
    }

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint128 votesFor; // Use uint128 to save space
        uint128 votesAgainst; // Use uint128 to save space
        bool votingPassed;
        uint64 votingDeadline; // Use uint64 for deadline timestamp
        uint128 fundsReceived; // Use uint128 to save space
        uint128 overallFundsReceived; // Use uint128 to save space
        bool executed;
        bool archived;
        uint64 dateCreated; // Use uint64 for date created timestamp
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public userVote;
    mapping(address => uint256[]) public userProposals;
    mapping(uint256 => mapping(address => uint256)) public donations;
    mapping(address => Donation[]) public userDonations;
    mapping(address => Withdrawal[]) public userWithdrawals;
 
    
    mapping(bytes32 => uint256[]) public titleToProposalIds;
    mapping(address => bool) public authorizedGovernance;
    address public owner;
    address[] public governanceAddresses;

    uint256 public proposalCount;
    uint128 public totalPot; // Change to uint128 to save space

    event ProposalCreated(uint256 proposalId, string title, string description);
    event Voted(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId, bool votingPassed);
    event ProposalRecreated(uint256 originalProposalId, uint256 newProposalId);
    event DonationReceived(uint256 proposalId, address donor, uint256 amount);
    event FundsAllocated(uint256 amount, address recipient);
    event WithdrawalMade(address user, uint256 amount, uint256 proposalId);

    modifier onlyGovernance() {
        require(
            authorizedGovernance[msg.sender],
            "Caller is not authorized governance"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createProposal(
        string memory _title,
        string memory _description,
        uint64 _votingDeadline
    ) public returns (uint256) {
        require(
            _votingDeadline > block.timestamp,
            "Voting deadline must be in the future"
        );

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount, // Automatically set id to proposalCount
            proposer: msg.sender,
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            votingDeadline: _votingDeadline,
            fundsReceived: 0,
            overallFundsReceived: 0,
            executed: false,
            archived: false,
            votingPassed: false,
            dateCreated: uint64(block.timestamp)
        });

        userProposals[msg.sender].push(proposalCount);
  
    // Normalize the title to lowercase and hash it
    bytes32 titleHash = keccak256(abi.encodePacked(toLowerCase(_title)));
  
    titleToProposalIds[titleHash].push(proposalCount);  // Store the proposal ID under the title hash

        emit ProposalCreated(proposalCount, _title, _description);
        return proposalCount;
    }

    function getExecutedProposals(
        uint256 start,
        uint256 count
    ) public view returns (Proposal[] memory, uint256) {
        uint256 executedCount = 0;
        uint256 totalExecuted = 0;

        // First pass to determine total executed proposals
        for (uint256 k = 1; k <= proposalCount; k++) {
            if (proposals[k].executed) {
                totalExecuted++;
            }
        }

        // Adjust start if out of bounds
        if (start >= totalExecuted) {
            return (new Proposal[](0), totalExecuted);
        }

        // Allocate memory for the paginated result
        Proposal[] memory paginatedProposals = new Proposal[](count);

        // Second pass to collect proposals starting from `start` up to `count`
        uint256 j = 0;
        for (uint256 i = 1; i <= proposalCount && j < count; i++) {
            if (proposals[i].executed) {
                if (executedCount >= start) {
                    paginatedProposals[j] = proposals[i];
                    j++;
                }
                executedCount++;
            }
        }

        return (paginatedProposals, totalExecuted);
    }

    function getNonExecutedProposals(
        uint256 start,
        uint256 count
    ) public view returns (Proposal[] memory, uint256) {
        uint256 nonExecutedCount = 0;
        uint256 totalNonExecuted = 0;

        // First pass to determine total non-executed proposals
        for (uint256 k = 1; k <= proposalCount; k++) {
            if (!proposals[k].executed) {
                totalNonExecuted++;
            }
        }

        // Adjust start if out of bounds
        if (start >= totalNonExecuted) {
            return (new Proposal[](0), totalNonExecuted);
        }

        // Allocate memory for the paginated result
        Proposal[] memory paginatedProposals = new Proposal[](count);

        // Second pass to collect proposals starting from `start` up to `count`
        uint256 j = 0;
        for (uint256 i = 1; i <= proposalCount && j < count; i++) {
            if (!proposals[i].executed) {
                if (nonExecutedCount >= start) {
                    paginatedProposals[j] = proposals[i];
                    j++;
                }
                nonExecutedCount++;
            }
        }

        return (paginatedProposals, totalNonExecuted);
    }

    function getUserProposals(
        address _user,
        uint256 start,
        uint256 count
    ) public view returns (uint256[] memory, uint256) {
        uint256[] storage userProposalsArray = userProposals[_user];
        uint256 length = userProposalsArray.length;

        // Check if the start index is out of bounds
        if (start >= length) {
            return (new uint256[](0), length); // Return an empty array
        }

        // Calculate the end index, ensuring it doesn't exceed the array length
        uint256 end = start + count;
        if (end > length) {
            end = length;
        }

        // Create a new array to store the paginated results
        uint256[] memory paginatedProposals = new uint256[](end - start);

        // Iterate through the array segment and copy the elements
        for (uint256 i = 0; i < end - start; i++) {
            uint256 currentIndex = start + i;
            paginatedProposals[i] = userProposalsArray[currentIndex];
        }

        return (paginatedProposals, length);
    }
function toLowerCase(string memory str) internal pure returns (string memory) {
    bytes memory bStr = bytes(str);
    bytes memory bLower = new bytes(bStr.length);
    for (uint i = 0; i < bStr.length; i++) {
        // Check if the character is uppercase
        if ((bStr[i] >= 0x41) && (bStr[i] <= 0x5A)) {
            // Convert to lowercase
            bLower[i] = bytes1(uint8(bStr[i]) + 32);
        } else {
            bLower[i] = bStr[i];
        }
    }
    return string(bLower);
}

    function searchProposals(string memory _title, uint256 start, uint256 count) public view returns (Proposal[] memory, uint256) {
    require(start >= 0, "Start index must be non-negative");
    require(count >= 0, "Count must be non-negative");
    bytes32 titleHash = keccak256(abi.encodePacked(toLowerCase(_title)));
    
    uint256[] storage proposalIds = titleToProposalIds[titleHash];
    uint256 totalProposals = proposalIds.length;

    // Early exit if there are no proposals with this title
    if (totalProposals == 0) {
        return (new Proposal[](0), 0);  // Return an empty array and 0 count
    }

    // Check if the start index is out of bounds
    if (start >= totalProposals) {
        return (new Proposal[](0), totalProposals);  // Return an empty array and the total count
    }

    // Calculate the end index, ensuring it doesn't exceed the array length
    uint256 end = start + count;
    if (end > totalProposals) {
        end = totalProposals;
    }

    // Create a new array to store the paginated results
    Proposal[] memory paginatedProposals = new Proposal[](end - start);

    // Iterate through the proposal IDs and fetch the corresponding proposals
    for (uint256 index = start; index < end; index++) {
        uint256 proposalId = proposalIds[index];
        paginatedProposals[index - start] = proposals[proposalId];
    }

    return (paginatedProposals, totalProposals);
}
    function getUserFundsSummary(
        address _user
    )
        public
        view
        returns (uint128 totalFundsReceived, uint128 totalFundsWithdrawn)
    {
        // Calculate total funds received
        uint256[] storage proposalsByUser = userProposals[_user];
        totalFundsReceived = 0;
        for (uint256 i = 0; i < proposalsByUser.length; i++) {
            uint256 proposalId = proposalsByUser[i];
            totalFundsReceived += proposals[proposalId].overallFundsReceived;
        }

        // Calculate total funds withdrawn
        Withdrawal[] storage userWithdrawalsArray = userWithdrawals[_user];
        totalFundsWithdrawn = 0;
        for (uint256 i = 0; i < userWithdrawalsArray.length; i++) {
            totalFundsWithdrawn += userWithdrawalsArray[i].amount;
        }

        return (totalFundsReceived, totalFundsWithdrawn);
    }

    function donateToProposal(uint256 _proposalId) public payable {
        require(
            _proposalId > 0 && _proposalId <= proposalCount,
            "Proposal does not exist"
        );
        require(!proposals[_proposalId].archived, "Proposal is archived");
        require(
            msg.value >= 0.00001 ether,
            "Donation must be greater than 0.00 ETH"
        );

        proposals[_proposalId].fundsReceived += uint128(msg.value);
        proposals[_proposalId].overallFundsReceived += uint128(msg.value);
        donations[_proposalId][msg.sender] += msg.value;
        totalPot += uint128(msg.value);

        userDonations[msg.sender].push(
            Donation({
                amount: uint128(msg.value),
                proposalId: _proposalId,
                timestamp: uint64(block.timestamp)
            })
        );

        emit DonationReceived(_proposalId, msg.sender, msg.value);
    }

    function getUserDonations(
        address _user,
        uint256 _start,
        uint256 _count
    )
        public
        view
        returns (Donation[] memory donationList, uint256 totalDonations)
    {
        totalDonations = userDonations[_user].length;

        // Ensure the start index is within bounds
        if (_start >= totalDonations) {
            return (new Donation[](0), totalDonations);
        }

        // Calculate the end index, ensuring it doesn't exceed the total length
        uint256 end = _start + _count;
        if (end > totalDonations) {
            end = totalDonations;
        }

        uint256 donationCount = end - _start;
        Donation[] memory result = new Donation[](donationCount);

        for (uint256 i = 0; i < donationCount; i++) {
            result[i] = userDonations[_user][_start + i];
        }

        return (result, totalDonations);
    }

    function getUserWithdrawals(
        address _user,
        uint256 start,
        uint256 count
    ) public view returns (Withdrawal[] memory, uint256) {
        Withdrawal[] storage withdrawalsList = userWithdrawals[_user];
        uint256 length = withdrawalsList.length;

        // Check if the start index is out of bounds
        if (start >= length) {
            return (new Withdrawal[](0), length); // Return an empty array and the total length
        }

        // Calculate the end index, ensuring it doesn't exceed the array length
        uint256 end = start + count;
        if (end > length) {
            end = length;
        }

        // Create a new array to store the paginated results
        Withdrawal[] memory paginatedWithdrawals = new Withdrawal[](
            end - start
        );

        // Iterate through the array segment and copy the elements
        for (uint256 i = 0; i < end - start; i++) {
            paginatedWithdrawals[i] = withdrawalsList[start + i];
        }

        return (paginatedWithdrawals, length);
    }

    function vote(uint256 _proposalId, bool _support) public {
        require(
            _proposalId > 0 && _proposalId <= proposalCount,
            "Proposal does not exist"
        );
        require(!proposals[_proposalId].archived, "Proposal is archived");
        require(
            block.timestamp < proposals[_proposalId].votingDeadline,
            "Voting period has ended"
        );

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
        require(
            _proposalId > 0 && _proposalId <= proposalCount,
            "Proposal does not exist"
        );
        require(!proposals[_proposalId].archived, "Proposal is archived");
        require(
            block.timestamp >= proposals[_proposalId].votingDeadline,
            "Voting period not ended"
        );
        require(!proposals[_proposalId].executed, "Already executed");

        Proposal storage proposal = proposals[_proposalId];
        bool votingPassed = proposal.votesFor >= proposal.votesAgainst;
        proposal.votingPassed = votingPassed;
        proposal.executed = true;
        if (!votingPassed) {
            // Archive the proposal if it does not pass
            proposal.archived = true;
        }

        emit ProposalExecuted(_proposalId, votingPassed);
    }

    function recreateProposal(uint256 _originalProposalId) public {
        require(
            _originalProposalId > 0 && _originalProposalId <= proposalCount,
            "Proposal does not exist"
        );
        Proposal memory originalProposal = proposals[_originalProposalId];
        require(originalProposal.archived, "Proposal must be archived first");
        require(
            msg.sender == originalProposal.proposer,
            "Only proposer can recreate"
        );

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            title: originalProposal.title,
            description: originalProposal.description,
            votesFor: 0,
            votesAgainst: 0,
            votingDeadline: uint64(block.timestamp) + 1 days,
            fundsReceived: 0,
            overallFundsReceived: 0,
            executed: false,
            archived: false,
            votingPassed: false,
            dateCreated: uint64(block.timestamp)
        });

        userProposals[msg.sender].push(proposalCount);

        emit ProposalRecreated(_originalProposalId, proposalCount);
        emit ProposalCreated(
            proposalCount,
            originalProposal.title,
            originalProposal.description
        );
    }

    function checkExpiredProposals() public {
        for (uint256 i = 1; i <= proposalCount; i++) {
            Proposal storage proposal = proposals[i];
            if (
                !proposal.executed && block.timestamp >= proposal.votingDeadline
            ) {
                executeProposal(i);
            }
        }
    }

    function getProposal(
        uint256 _proposalId
    ) public view returns (Proposal memory) {
        require(
            _proposalId > 0 && _proposalId <= proposalCount,
            "Proposal does not exist"
        );
        return proposals[_proposalId];
    }

    function allocateFromPot(
        uint256 amount,
        address recipient
    ) public onlyGovernance {
        require(amount <= totalPot, "Insufficient funds in the pot");
        totalPot -= uint128(amount);
        payable(recipient).transfer(amount);

        emit FundsAllocated(amount, recipient);
    }

    function allocateFundsToProposer(uint256 _proposalId) public {
        require(
            _proposalId > 0 && _proposalId <= proposalCount,
            "Proposal does not exist"
        );

        Proposal storage proposal = proposals[_proposalId];
        require(
            msg.sender == proposal.proposer,
            "Only the proposer can withdraw allocated funds"
        );
        require(
            proposal.executed,
            "Proposal must be executed before funds can be allocated"
        );
        require(
            proposal.votingPassed,
            "Proposal must have passed to allocate funds"
        );
        require(
            proposal.fundsReceived > 0,
            "No funds available for allocation"
        );

        uint128 allocation = proposal.fundsReceived;
        uint128 platformCut = (allocation * 3) / 100; // 3% cut
        uint128 finalAmount = allocation - platformCut;

        totalPot -= allocation;
        payable(proposal.proposer).transfer(finalAmount); // Transfer to proposer after cut

        // Track the withdrawal
        userWithdrawals[proposal.proposer].push(
            Withdrawal({
                amount: finalAmount,
                proposalId: _proposalId,
                timestamp: uint64(block.timestamp)
            })
        );

        proposal.fundsReceived = 0; // Reset funds received after allocation
        emit FundsAllocated(finalAmount, proposal.proposer);
        emit WithdrawalMade(proposal.proposer, finalAmount, _proposalId); // Emit the withdrawal event
    }

    function archiveProposal(uint256 _proposalId) public {
        require(
            _proposalId > 0 && _proposalId <= proposalCount,
            "Proposal does not exist"
        );
        require(
            msg.sender == proposals[_proposalId].proposer,
            "Only proposer can archive"
        );
        proposals[_proposalId].archived = true;
    }

    // Authorize governance address
    function authorizeGovernance(address _governanceAddress) public onlyOwner {
        require(
            !authorizedGovernance[_governanceAddress],
            "Already authorized"
        );
        authorizedGovernance[_governanceAddress] = true;
        governanceAddresses.push(_governanceAddress); // Add to the array of governance addresses
    }

    // Function to retrieve all governance addresses
    function getGovernanceAddresses() public view returns (address[] memory) {
        return governanceAddresses;
    }

    // Function to revoke governance access
    function revokeGovernance(address _governanceAddress) public onlyOwner {
        require(
            authorizedGovernance[_governanceAddress],
            "Not an authorized governance address"
        );
        authorizedGovernance[_governanceAddress] = false;

        // Remove address from the array (optional; requires additional logic)
        for (uint i = 0; i < governanceAddresses.length; i++) {
            if (governanceAddresses[i] == _governanceAddress) {
                governanceAddresses[i] = governanceAddresses[
                    governanceAddresses.length - 1
                ]; // Move the last element to the removed spot
                governanceAddresses.pop(); // Remove the last element
                break;
            }
        }
    }
}
