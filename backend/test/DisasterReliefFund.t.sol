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
        uint256 votingDeadline = block.timestamp + 7 days; // Set voting deadline to 7 days from now
        fund.createProposal("Aid for Earthquake Victims", "Providing aid to affected areas", votingDeadline);

        // Access proposal using getProposal function
        DisasterReliefFund.Proposal memory proposal = fund.getProposal(1); // Assuming getProposal returns a Proposal struct

        assertEq(proposal.title, "Aid for Earthquake Victims");
        assertEq(proposal.description, "Providing aid to affected areas");
        assertEq(proposal.votesFor, 0);
        assertEq(proposal.votesAgainst, 0);
        assertEq(proposal.fundsReceived, 0);
        assertEq(proposal.executed, false);
        assertEq(proposal.archived, false);
        assertEq(proposal.votingPassed, false);
        assertEq(proposal.votingDeadline, votingDeadline); // Verify the fetched deadline matches
        assertEq(proposal.dateCreated, block.timestamp); 
    }

    // Test donation to a proposal
    function testDonateToProposal() public {
        uint256 votingDeadline = block.timestamp + 7 days; // Set voting deadline
        fund.createProposal("Flood Relief", "Help for flood victims", votingDeadline);
        
        uint256 initialPot = fund.totalPot();
        uint256 donationAmount = 1 ether;

        // Donate to the proposal
        payable(address(fund)).transfer(donationAmount);
        fund.donateToProposal{value: donationAmount}(1);

        // Access proposal using getProposal function
        DisasterReliefFund.Proposal memory proposal = fund.getProposal(1);

        assertEq(proposal.fundsReceived, donationAmount);
        assertEq(fund.totalPot(), initialPot + donationAmount); // Check total pot updated
    }

    // Test proposal execution and fund transfer
    function testExecuteProposalWithDonations() public {
        // Create proposal and donate
        uint256 votingDeadline = block.timestamp + 7 days; // Set voting deadline
        fund.createProposal("Wildfire Recovery", "Support for wildfire victims", votingDeadline);
        payable(address(fund)).transfer(1 ether);
        fund.donateToProposal{value: 1 ether}(1);

        // Vote and execute
        fund.vote(1, true);
        vm.warp(block.timestamp + 2 days); // Move forward in time to pass deadline
        fund.executeProposal(1);

        // Access proposal using getProposal function
        DisasterReliefFund.Proposal memory proposal = fund.getProposal(1);

        assertEq(proposal.executed, true);
        assertEq(proposal.archived, true);
        assertEq(proposal.fundsReceived, 1 ether);
    }

    // Test allocation of funds from the total pot
    function testAllocateFromPot() public {
        uint256 initialPot = fund.totalPot();
        uint256 allocationAmount = 0.5 ether;

        // Ensure pot has enough funds
        payable(address(fund)).transfer(1 ether);
        fund.donateToProposal{value: 1 ether}(1);

        // Allocate funds
        fund.allocateFromPot(allocationAmount, address(this)); // Assuming you want to use the current contract address

        assertEq(fund.totalPot(), initialPot + 1 ether - allocationAmount); // Ensure deduction from total pot
    }

    // Test voting on a proposal
    function testVoteOnProposal() public {
        uint256 votingDeadline = block.timestamp + 7 days; // Set voting deadline
        fund.createProposal("Support for Flood Relief", "Immediate flood response", votingDeadline);
        fund.vote(1, true); // Vote in support

        // Access proposal using getProposal function
        DisasterReliefFund.Proposal memory proposal = fund.getProposal(1);

        assertEq(proposal.votesFor, 1);
        assertEq(proposal.votesAgainst, 0);
        assertEq(proposal.votingPassed, false); // Check if passed status is still false
    }

    // Test proposal recreation after archiving
    function testRecreateArchivedProposal() public {
        // Create and archive the initial proposal
        uint256 votingDeadline = block.timestamp + 7 days; // Set voting deadline
        fund.createProposal("Initial Proposal", "An initial proposal to be archived", votingDeadline);
        fund.vote(1, false); // Vote against
        vm.warp(block.timestamp + 2 days);  // Move forward in time to pass the deadline
        fund.executeProposal(1);

        // Ensure the proposal is archived
        DisasterReliefFund.Proposal memory proposal = fund.getProposal(1);
        assertEq(proposal.archived, true);

        // Recreate the archived proposal
        fund.recreateProposal(1);

        // Access individual fields from the newly created proposal
        DisasterReliefFund.Proposal memory newProposal = fund.getProposal(2); // Get the new proposal details

        assertEq(newProposal.title, "Initial Proposal");
        assertEq(newProposal.description, "An initial proposal to be archived");
        assertEq(newProposal.votesFor, 0);
        assertEq(newProposal.votesAgainst, 0);
        assertEq(newProposal.fundsReceived, 0); // Check new proposal has zero funds
        assertEq(newProposal.executed, false);
        assertEq(newProposal.archived, false);
        assertEq(newProposal.votingPassed, false); // Check passed status for recreated proposal
        assertEq(newProposal.dateCreated, block.timestamp);
    }

    // Test adding governance address
   // Test authorizing governance address
    function testAuthorizeGovernance() public {
        address governanceAddress = address(0x123); // Example governance address
        fund.authorizeGovernance(governanceAddress); // Call the authorizeGovernance function

        // Verify that the governance address was authorized
        bool isAuthorized = fund.authorizedGovernance(governanceAddress); // Check mapping
        assertTrue(isAuthorized, "Governance address should be authorized");
    }


  // Test revoking governance address
    function testRevokeGovernance() public {
        address governanceAddress = address(0x123); // Example governance address
        fund.authorizeGovernance(governanceAddress); // First authorize it

        // Now revoke the governance address
        fund.revokeGovernance(governanceAddress);

        // Verify that the governance address was revoked
        bool isAuthorized = fund.authorizedGovernance(governanceAddress); // Check mapping
        assertFalse(isAuthorized, "Governance address should be revoked");
    }

    // Test revoking governance that is not authorized
    function testRevokeNonExistentGovernance() public {
        address nonExistentAddress = address(0x456); // Address not authorized

        // Attempt to revoke it and expect a revert
        vm.expectRevert("Not an authorized governance address");
        fund.revokeGovernance(nonExistentAddress);
    }
}
