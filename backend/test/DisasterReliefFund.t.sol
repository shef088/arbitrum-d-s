// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {Test, console} from "forge-std/Test.sol";
import {DisasterReliefFund} from "../src/DisasterReliefFund.sol";

contract DisasterReliefFundTest is Test {
    DisasterReliefFund public fund;
    address public proposer = address(0x123);

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
            uint256 fundsReceived,
            bool executed,
            bool archived,
            bool passed
        ) = fund.proposals(1);

        assertEq(title, "Aid for Earthquake Victims");
        assertEq(description, "Providing aid to affected areas");
        assertEq(votesFor, 0);
        assertEq(votesAgainst, 0);
        assertEq(fundsReceived, 0); // Initial funds should be 0
        assertEq(executed, false);
        assertEq(archived, false);
        assertEq(passed, false);
    }

    // Test donation to a proposal
    function testDonateToProposal() public {
        fund.createProposal("Flood Relief", "Help for flood victims");
        
        uint256 initialPot = fund.totalPot();
        uint256 donationAmount = 1 ether;

        // Donate to the proposal
        payable(address(fund)).transfer(donationAmount);
        fund.donateToProposal{value: donationAmount}(1);

        (, , , , , , uint256 fundsReceived, , , ) = fund.proposals(1);

        assertEq(fundsReceived, donationAmount);
        assertEq(fund.totalPot(), initialPot + donationAmount); // Check total pot updated
    }

    // Test proposal execution and fund transfer
    function testExecuteProposalWithDonations() public {
        // Create proposal and donate
        fund.createProposal("Wildfire Recovery", "Support for wildfire victims");
        payable(address(fund)).transfer(1 ether);
        fund.donateToProposal{value: 1 ether}(1);

        // Vote and execute
        fund.vote(1, true);
        vm.warp(block.timestamp + 2 days); // Move forward in time to pass deadline
        fund.executeProposal(1);

        (, , , , , , uint256 fundsReceived, bool executed, bool archived, bool passed) = fund.proposals(1);

        assertEq(executed, true);
        assertEq(archived, true);
        assertEq(passed, true);
        assertEq(fundsReceived, 1 ether);
    }

    // Test allocation of funds from the total pot
    function testAllocateFromPot() public {
        uint256 initialPot = fund.totalPot();
        uint256 allocationAmount = 0.5 ether;

        // Ensure pot has enough funds
        payable(address(fund)).transfer(1 ether);
        fund.donateToProposal{value: 1 ether}(1);

        // Allocate funds
        fund.allocateFromPot(allocationAmount, proposer);

        assertEq(fund.totalPot(), initialPot + 1 ether - allocationAmount); // Ensure deduction from total pot
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
            uint256 fundsReceived,
            bool executed,
            bool archived,
            bool passed
        ) = fund.proposals(1);

        assertEq(votesFor, 1);
        assertEq(votesAgainst, 0);
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
        (, , , , , , , , bool archived, ) = fund.proposals(1);
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
            uint256 fundsReceived,
            bool executed,
            bool archivedNew,
            bool passedNew
        ) = fund.proposals(2);

        assertEq(title, "Initial Proposal");
        assertEq(description, "An initial proposal to be archived");
        assertEq(votesFor, 0);
        assertEq(votesAgainst, 0);
        assertEq(fundsReceived, 0); // Check new proposal has zero funds
        assertEq(executed, false);
        assertEq(archivedNew, false);
        assertEq(passedNew, false); // Check passed status for recreated proposal
    }
}
