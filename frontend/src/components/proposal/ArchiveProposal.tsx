// ArchiveProposal.jsx
import React from 'react';

const ArchiveProposal = ({ proposal, address, handleArchive }) => {
    return (
        <>
            {proposal.proposer === address && !proposal.archived && (
                <div className="archive-section">
                    <span>Equivalent to set proposal inactive/delete. (Permanently set to inactive)</span>
                    <button onClick={handleArchive}>Archive Proposal</button>
                </div>
            )}
        </>
    );
};

export default ArchiveProposal;
