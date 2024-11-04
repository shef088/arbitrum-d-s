// VoteButtons.jsx
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';  
const VoteButtons = ({ proposal, handleVote }) => {
    return (
        <div className="vote-buttons">
            {!proposal.executed && (
                <>
                    <button onClick={() => handleVote(true)} className="up-vote-btn">
                        <FaArrowUp className="vote-icon" /> {Number(proposal.votesFor)}
                    </button>
                    <button onClick={() => handleVote(false)} className="down-vote-btn">
                        <FaArrowDown className="vote-icon" /> {Number(proposal.votesAgainst)}
                    </button>
                </>
            )}
        </div>
    );
};

export default VoteButtons;
