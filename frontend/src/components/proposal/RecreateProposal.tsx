// RecreateProposal.jsx
import React from 'react';

const RecreateProposal = ({ proposal, recreateProposal }) => {
    return (
        <>
            {proposal.archived && (
                <div className="recreate-section">
                    <button onClick={() => recreateProposal()}>Recreate Proposal</button>
                </div>
            )}
        </>
    );
};

export default RecreateProposal;
