// FundsInfo.jsx
import React from 'react';
import { ethers } from 'ethers'; // Make sure you have ethers.js installed

const WidthdrawProposalFunds = ({ proposal, ethToUsdRate, allocateFundsToProposer }) => {
    return (
        <>
            {proposal.fundsReceived > 0 && (
                <div className="note-section-container">
                    <span>Note: Withdrawals have a fee of 3% for the upkeep of the platform</span>

                    <div className="funds-info">
                        <div className="available-funds">
                            <span>Available Funds:</span>
                            <span className="received-amount">
                                {proposal.fundsReceived
                                    ? ethers.formatEther(proposal.fundsReceived)
                                    : "0"} ETH 
                                ({proposal.fundsReceived
                                    ? (parseFloat(ethers.formatEther(proposal.fundsReceived)) * (ethToUsdRate || 0)).toFixed(2)
                                    : "0"} USD $)
                            </span>
                        </div>

                        <div className="available-funds">
                            <span>After 3% cut:</span>

                            <div className="received-amount">
                                <span className="eth-received">
                                    {proposal.fundsReceived > 0
                                        ? ethers.formatEther(
                                            BigInt(proposal.fundsReceived) * BigInt(0.97 * 1e18) / BigInt(1e18) // Subtract 3% from ETH
                                          )
                                        : "0"} ETH | USD $
                                    {proposal.fundsReceived > 0
                                        ? ((parseFloat(ethers.formatEther(
                                            BigInt(proposal.fundsReceived) * BigInt(0.97 * 1e18) / BigInt(1e18))) * (ethToUsdRate || 0)) * 0.97).toFixed(2) // Subtract 3% from USD
                                        : "0"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button className="withdraw-button" onClick={allocateFundsToProposer}>Withdraw funds</button>
                </div>
            )}
        </>
    );
};

export default WidthdrawProposalFunds;
