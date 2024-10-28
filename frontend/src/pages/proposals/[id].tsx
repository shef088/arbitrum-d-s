// pages/proposals/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import fetchProposalById from '../../utils/fetchProposalById';
import { readContract, writeContract } from "@wagmi/core"; // Import writeContract
import config from "../../wagmi"; // Ensure this import is correct
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import type { ProposalResponse } from '../../types/proposals/types';

const ProposalDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [proposal, setProposal] = useState<ProposalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null); // State for vote error

  useEffect(() => {
    const getProposalDetails = async () => {
      if (!id) return; // Guard clause for when id is not available
      setLoading(true);
      try {
        const proposalId = Number(id);
        const foundProposal = await fetchProposalById(proposalId);
        if (foundProposal) {
          setProposal(foundProposal);
        } else {
          setError('Proposal not found');
        }
      } catch (err) {
        setError(err.message); // Update error state with the caught error message
      } finally {
        setLoading(false);
      }
    };

    getProposalDetails();
  }, [id]);

  const handleVote = async (voteFor: boolean) => {
    if (!proposal) return;

    // Check if voting period has ended
    if (Date.now() >= Number(proposal.deadline) * 1000) {
      setVoteError('Voting period has ended for this proposal.');
      return;
    }

    try {
      const proposalId = Number(id);
      await writeContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'vote',
        args: [proposalId, voteFor],
      });

      // Alert user on successful voting
      alert(`Successfully voted ${voteFor ? 'for' : 'against'} proposal ${proposal.title}`);

      // Refetch proposal details after voting
      const foundProposal = await fetchProposalById(proposalId);
      if (foundProposal) {
        setProposal(foundProposal);
      } else {
        setError('Proposal not found after voting');
      }
      
    } catch (err) {
      console.error("Error voting:", err);
      setVoteError("Error casting your vote");
    }
  };

  if (loading) return <p>Loading proposal details...</p>;
  if (error) return <p>{error}</p>;
  if (!proposal) return <p>No proposal data available.</p>;

  return (
    <div className="proposal-detail">
      <h2>{proposal.title}</h2>
      <p>{proposal.description}</p>
      <div className="proposal-stats">
        <p>Votes For: {Number(proposal.votesFor)}</p>
        <p>Votes Against: {Number(proposal.votesAgainst)}</p>
        <p>Deadline: {new Date(Number(proposal.deadline) * 1000).toLocaleString()}</p>
        <p>Status: {proposal.executed ? "Executed" : "Pending"}</p>
      </div>
      <div className="vote-buttons">
        {!proposal.executed && (
          <>
            <button onClick={() => handleVote(true)}>Vote For</button>
            <button onClick={() => handleVote(false)}>Vote Against</button>
          </>
        )}
      </div>
      {voteError && <p style={{ color: 'red' }}>{voteError}</p>} {/* Display vote error */}
    </div>
  );
};

export default ProposalDetail;
