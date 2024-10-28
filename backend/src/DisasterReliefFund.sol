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
        bool archived;
        bool passed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Tracks if a user has voted on a proposal
    mapping(uint256 => mapping(address => bool)) public userVote; // Tracks the user's vote (true for 'for', false for 'against')

    uint256 public proposalCount;

    event ProposalCreated(uint256 proposalId, string title, string description);
    event Voted(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId, bool passed);
    event ProposalRecreated(uint256 originalProposalId, uint256 newProposalId);

    function createProposal(string memory _title, string memory _description) public {
        proposalCount++;
        proposals[proposalCount] = Proposal({
            proposer: msg.sender,
            title: _title,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + 1 days,
            executed: false,
            archived: false,
            passed: false
        });
        emit ProposalCreated(proposalCount, _title, _description);
    }

    function vote(uint256 _proposalId, bool _support) public {
    require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
    require(!proposals[_proposalId].archived, "Proposal is archived");
    require(block.timestamp < proposals[_proposalId].deadline, "Voting period has ended");

    // Check if the user has voted before
    bool previousVote = userVote[_proposalId][msg.sender];

    if (hasVoted[_proposalId][msg.sender]) {
        // User has voted before, check if the vote needs to be updated
        if (previousVote == _support) {
            // User is attempting to vote the same way again
            if (_support) {
                revert("Already voted for this proposal.");
            } else {
                revert("Already voted against this proposal.");
            }
        } else {
            // If the vote is being changed, update the vote count
            if (_support) {
                proposals[_proposalId].votesFor++;
                proposals[_proposalId].votesAgainst--;
            } else {
                proposals[_proposalId].votesFor--;
                proposals[_proposalId].votesAgainst++;
            }
        }
    } else {
        // User is voting for the first time
        hasVoted[_proposalId][msg.sender] = true;

        if (_support) {
            proposals[_proposalId].votesFor++;
        } else {
            proposals[_proposalId].votesAgainst++;
        }
    }

    // Update the user's vote status
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
            executed: false,
            archived: false,
            passed: false
        });

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
}
