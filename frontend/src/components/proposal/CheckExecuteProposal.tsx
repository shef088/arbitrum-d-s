// CheckExecuteProposal.jsx
import React from 'react';

const CheckExecuteProposal = ({ proposal, handleCheckExpiredAndExecute, countdown  }) => {
    const isExpired = countdown <= 0
    return (
        <>
            {!proposal.executed && !proposal.archived && isExpired && (
                <div className="check-exp">
                   
                    <span>Proposal expiry checks are automatically checked on the blockchain every 24 hours with chainlink automation. Only execute if urgent! </span>
                    <span>
                        Execute if your proposal's voting period has ended but proposal status is still Voting. (Triggers execute if expired)
                    </span>
                    <button onClick={handleCheckExpiredAndExecute}>Execute Expired </button>
                </div>
            )}
        </>
    );
};

export default CheckExecuteProposal;
