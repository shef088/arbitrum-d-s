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
        fund.createProposal("Aid for Earthquake Victims", 10 ether, 7 days);
        DisasterReliefFund.Proposal memory proposal = fund.proposals(0);
        assertEq(proposal.description, "Aid for Earthquake Victims");
        assertEq(proposal.fundingGoal, 10 ether);
        assertEq(proposal.isActive, true);
    }

    // Test donation to a proposal
    function testDonateToProposal() public {
        fund.createProposal("Aid for Flood Victims", 5 ether, 7 days);
        fund.donateToProposal(0, {value: 1 ether});
        DisasterReliefFund.Proposal memory proposal = fund.proposals(0);
        assertEq(proposal.amountRaised, 1 ether);
    }

    // Test voting on a proposal
    function testVoteOnProposal() public {
        fund.createProposal("Support for Hurricane Relief", 8 ether, 7 days);
        fund.voteOnProposal(0, true); // Vote in support
        DisasterReliefFund.Proposal memory proposal = fund.proposals(0);
        assertEq(proposal.votesFor, 1);
    }

    // Test approval of funding
    function testApproveFunding() public {
        fund.createProposal("Support for Wildfire Relief", 3 ether, 7 days);
        fund.voteOnProposal(0, true); // Vote in support
        fund.voteOnProposal(0, false); // Vote against
        fund.approveFunding(0);
        DisasterReliefFund.Proposal memory proposal = fund.proposals(0);
        assertEq(proposal.isActive, false);
    }
}
