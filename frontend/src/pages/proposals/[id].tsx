// pages/proposals/[id].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import fetchProposalById from '../../utils/fetchProposalById';
import { readContract, writeContract } from "@wagmi/core"; 
import config from "../../wagmi"; 
import { ABI, deployedAddress } from "../../contracts/deployed-contract"; 
import type { ProposalResponse } from '../../types/proposals/types'; 
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';


const ProposalDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [proposal, setProposal] = useState<ProposalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const { isConnected, address } = useAccount(); 
  
  useEffect(() => {
    const getProposalDetails = async () => {
      if (!id) return;
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getProposalDetails();
  }, [id, isConnected, address]);

  const handleVote = async (voteFor: boolean) => {
    if (!proposal) return;

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

      toast.success(`Successfully voted ${voteFor ? 'for' : 'against'} proposal ${proposal.title}`);

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
  if (error) return <p className="error">{error}</p>;
  if (!proposal) return <p>No proposal data available.</p>;

  return (<div className="proposal-detail-container">
     <h2>Proposal Details</h2><br/>
    <div className="proposal-detail">

    <h2>{proposal.title}</h2>
      <p>Description: {proposal.description}</p>
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
      {voteError && <p className="error">{voteError}</p>} {/* Display vote error */}
    </div>
    </div>);
};

export default ProposalDetail;
