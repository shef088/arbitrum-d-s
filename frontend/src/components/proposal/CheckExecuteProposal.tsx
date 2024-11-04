// CheckExecuteProposal.jsx
import React from 'react';

const CheckExecuteProposal = ({ proposal, handleCheckExpiredAndExecute }) => {
    return (
        <>
            {!proposal.executed && !proposal.archived && (
                <div className="check-exp">
                    <span>
                        Execute if your proposal's voting period has ended but proposal status is still Voting. (Triggers execute if expired)
                    </span>
                    <span>Proposal expiry checks are automated on the blockchain every 24 hours. Only execute if urgent! </span>
                    <button onClick={handleCheckExpiredAndExecute}>Execute Proposal</button>
                </div>
            )}
        </>
    );
};

export default CheckExecuteProposal;
