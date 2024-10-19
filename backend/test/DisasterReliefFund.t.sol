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
            bool executed
        ) = fund.proposals(1);

        assertEq(title, "Aid for Earthquake Victims");
        assertEq(description, "Providing aid to affected areas");
        assertEq(votesFor, 0);
        assertEq(votesAgainst, 0);
        assertEq(executed, false);
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
            bool executed
        ) = fund.proposals(1);

        assertEq(votesFor, 1);
        assertEq(votesAgainst, 0);
    }

    // Test proposal execution
    function testExecuteProposal() public {
        fund.createProposal("Aid for Wildfire Recovery", "Funds for wildfire victims");
        fund.vote(1, true);  // Vote in support
        vm.warp(block.timestamp + 2 days);  // Move forward in time
        fund.executeProposal(1);

        // Access individual fields from the proposal
        (
            address proposer,
            string memory title,
            string memory description,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 deadline,
            bool executed
        ) = fund.proposals(1);

        assertEq(executed, true);
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
            bool executed
        ) = fund.proposals(1);

        assertEq(votesAgainst, 1);
        assertEq(votesFor, 0);
    }
}
