// pages/pendingProposals.tsx
import React, { useEffect, useState } from 'react';
import fetchPendingProposals from '../../utils/fetchPendingProposals';
import type { ProposalResponse } from '../../types/proposals/types';
import Link from 'next/link';
import { useAccount } from "wagmi";
const PendingProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount(); 

  useEffect(() => {
    const getPendingProposals = async () => {
      setLoading(true);
      if (!isConnected || !address) {
 
        return; 
      }
      try {
        const fetchedProposals = await fetchPendingProposals();
        setProposals(fetchedProposals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getPendingProposals();
  }, [isConnected, address]);

 
  if (loading) return <p>Loading pending proposals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Pending Proposals</h2>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : proposals.length === 0 ? (
        <p>No pending proposals found.</p>  
      ) : (
        proposals.map((proposal, index) => (
          <div className="pending-proposal" key={index}>
              <Link href={`/proposals/${proposal.id}`}>
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <p>Votes For: {Number(proposal.votesFor)}</p>
            <p>Votes Against: {Number(proposal.votesAgainst)}</p>
            <p>Executed: {proposal.executed ? 'True' : 'False'}</p>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingProposals;
