// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Test, console} from "forge-std/Test.sol";
import {DisasterReliefFund} from "../src/DisasterReliefFund.sol";

contract DisasterReliefFundTest is Test {
    DisasterReliefFund public fund;

    // Set up the contract
    function setUp() public {
        fund = new DisasterReliefFund();
    }

    // Test proposal creation
    function testCreateProposal() public {
        fund.createProposal("Aid for Earthquake Victims", "Providing aid to affected areas");

        // Access individual fields from the proposal
        (
            address proposer,
            string memory title,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 deadline,
            bool executed,
            bool archived,
            bool passed // New field
        ) = fund.proposals(1);

        assertEq(title, "Aid for Earthquake Victims");
        assertEq(description, "Providing aid to affected areas");
        assertEq(votesFor, 0);
        assertEq(votesAgainst, 0);
        assertEq(executed, false);
        assertEq(archived, false);
        assertEq(passed, false); // Check initial passed state
    }

    // Test voting on a proposal
    function testVoteOnProposal() public {
        fund.createProposal("Support for Flood Relief", "Immediate flood response");
        fund.vote(1, true); // Vote in support

        // Access individual fields from the proposal
        (
            address proposer,
            string memory title,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 deadline,
            bool executed,
            bool archived,
            bool passed // New field
        ) = fund.proposals(1);

        assertEq(votesFor, 1);
        assertEq(votesAgainst, 0);
        assertEq(passed, false); // Check if passed status is still false
    }

    // Test proposal execution and archiving
    function testExecuteAndArchiveProposal() public {
        fund.createProposal("Aid for Wildfire Recovery", "Funds for wildfire victims");
        fund.vote(1, true);  // Vote in support
        vm.warp(block.timestamp + 2 days);  // Move forward in time to pass the deadline
        fund.executeProposal(1);

        // Access individual fields from the proposal
        (
            address proposer,
            string memory title,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 deadline,
            bool executed,
            bool archived,
            bool passed // New field
        ) = fund.proposals(1);

        assertEq(executed, true);
        assertEq(archived, true);
        assertEq(passed, true); // Check if passed status is set to true after execution
    }

    // Test voting against a proposal
    function testVoteAgainstProposal() public {
        fund.createProposal("Aid for Hurricane Victims", "Hurricane relief efforts");
        fund.vote(1, false); // Vote against

        // Access individual fields from the proposal
        (
            address proposer,
            string memory title,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 deadline,
            bool executed,
            bool archived,
            bool passed // New field
        ) = fund.proposals(1);

        assertEq(votesAgainst, 1);
        assertEq(votesFor, 0);
        assertEq(passed, false); // Check if passed status is still false
    }

    // Test proposal recreation after archiving
    function testRecreateArchivedProposal() public {
        // Create and archive the initial proposal
        fund.createProposal("Initial Proposal", "An initial proposal to be archived");
        fund.vote(1, false); // Vote against
        vm.warp(block.timestamp + 2 days);  // Move forward in time to pass the deadline
        fund.executeProposal(1);

        // Ensure the proposal is archived
        (, , , , , , , bool archived, ) = fund.proposals(1);
        assertEq(archived, true);

        // Recreate the archived proposal
        fund.recreateProposal(1);

        // Access individual fields from the newly created proposal
        (
            address proposer,
            string memory title,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 deadline,
            bool executed,
            bool archivedNew,
            bool passedNew // New field for recreated proposal
        ) = fund.proposals(2);

        assertEq(title, "Initial Proposal");
        assertEq(description, "An initial proposal to be archived");
        assertEq(votesFor, 0);
        assertEq(votesAgainst, 0);
        assertEq(executed, false);
        assertEq(archivedNew, false);
        assertEq(passedNew, false); // Check passed status for recreated proposal
    }
}
