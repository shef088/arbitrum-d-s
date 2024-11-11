// ProposalStats.jsx
import React from 'react';
import { ethers } from 'ethers'; // Ensure ethers is installed and imported

const ProposalStats = ({ proposal, ethToUsdRate }) => {
    return (
        <div className="proposal-stats">
            <p>Status:
                {proposal.archived
                    ? <span className='error'>Archived (Cannot receive votes or donations!)</span>
                    : proposal.executed
                        ? (proposal.votingPassed ? <span> Approved for Donations/Funding</span> :<span> Rejected</span>)
                        : " Voting"}
            </p>

            <p>
                Overall Received Funds: <span className="funds-p"> 
                    {proposal.fundsReceived ? ethers.formatEther(proposal.fundsReceived) : "0"} ETH
                    ({proposal.overallFundsReceived ? (parseFloat(ethers.formatEther(proposal.overallFundsReceived)) * (ethToUsdRate || 0)).toFixed(2) : "0"} USD $)
                </span>
            </p>
            <p>
                Available Funds: <span className="funds-p"> 
                    {proposal.fundsReceived ? ethers.formatEther(proposal.fundsReceived) : "0"} ETH
                    ({proposal.fundsReceived ? (parseFloat(ethers.formatEther(proposal.fundsReceived)) * (ethToUsdRate || 0)).toFixed(2) : "0"} USD $)
                </span>
            </p>
        </div>
    );
};

export default ProposalStats;
