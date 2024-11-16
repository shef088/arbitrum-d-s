import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';  
import type { ProposalResponse } from "../../types/proposals/types";
import fetchProposalById from '../../utils/fetchProposalById';

interface VoteButtonsProps {
    proposal: ProposalResponse;
    handleVote: (vote: boolean) => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ proposal, handleVote }) => {
    const [votesFor, setVotesFor] = useState<number>(0);
    const [votesAgainst, setVotesAgainst] = useState<number>(0);

    useEffect(() => {
        const fetchProposalDetails = async () => {
            try {
                // Fetch updated proposal details
                const proposalUpdate = await fetchProposalById(Number(proposal.id));
                if (proposalUpdate) {
                    // Update state with fetched votes
                    setVotesFor(Number(proposalUpdate.votesFor));
                    setVotesAgainst(Number(proposalUpdate.votesAgainst));
                }
            } catch (error) {
                console.error('Error fetching proposal details in votes:', error);
            }
        };

        // Call the fetch function
        fetchProposalDetails();
    }, [proposal]);  // Trigger on proposal change

    return (
        <div className="vote-buttons">
            {!proposal.executed && (
                <>
                    <button onClick={() => handleVote(true)} className="up-vote-btn">
                        <FaArrowUp className="vote-icon" /> <span>{votesFor}</span>
                    </button>
                    <button onClick={() => handleVote(false)} className="down-vote-btn">
                        <FaArrowDown className="vote-icon" /> <span>{votesAgainst}</span>
                    </button>
                </>
            )}
        </div>
    );
};

export default VoteButtons;
