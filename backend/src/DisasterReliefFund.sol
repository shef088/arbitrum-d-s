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
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public votes; // Nested mapping for tracking votes

    uint256 public proposalCount;

    event ProposalCreated(uint256 proposalId, string title, string description);
    event Voted(uint256 proposalId, address voter, bool support);

    // Function to create a new proposal
    function createProposal(string memory _title, string memory _description) public {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            proposer: msg.sender,
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + 1 days, // Set a deadline of 1 day for voting
            executed: false
        });
        emit ProposalCreated(proposalCount, _title, _description);
    }

    // Function to vote on a proposal
    function vote(uint256 _proposalId, bool _support) public {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        require(block.timestamp < proposals[_proposalId].deadline, "Voting has ended");
        require(!votes[_proposalId][msg.sender], "You have already voted");

        // Record the vote
        votes[_proposalId][msg.sender] = true;

        if (_support) {
            proposals[_proposalId].votesFor++;
        } else {
            proposals[_proposalId].votesAgainst++;
        }

        emit Voted(_proposalId, msg.sender, _support);
    }

    // Function to execute the proposal if it passes
    function executeProposal(uint256 _proposalId) public {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        require(block.timestamp >= proposals[_proposalId].deadline, "Voting has not ended");
        require(!proposals[_proposalId].executed, "Proposal already executed");

        // Logic to determine if the proposal passes and should be executed
        if (proposals[_proposalId].votesFor > proposals[_proposalId].votesAgainst) {
            proposals[_proposalId].executed = true;
            // Implement fund distribution or other logic
        }
    }
}
