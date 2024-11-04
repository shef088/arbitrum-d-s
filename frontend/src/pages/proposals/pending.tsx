// pages/pendingProposals.tsx
import React, { useEffect, useState } from 'react';
import fetchPendingProposals from '../../utils/fetchPendingProposals';
import type { ProposalResponse } from '../../types/proposals/types';
import Link from 'next/link';
import { useAccount } from "wagmi";
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
 

const PendingProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount();

  useEffect(() => {
    const getPendingProposals = async () => {
    
      setLoading(true);
      
      try {
        const fetchedProposals = await fetchPendingProposals();
        setProposals(fetchedProposals);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getPendingProposals();
  }, [isConnected, address]);

  if (loading) return <Loader/>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="proposals-container">
      <h2>Pending Proposals</h2>
      {proposals.length === 0 ? (
        <p>No pending proposals found.</p>
      ) : (
        proposals.map((proposal) => (
          <div className="inner-proposal" key={proposal.id}>
            <Link href={`/proposals/${proposal.id}`}>
              <h3 className="proposal-title">{proposal.title}</h3>
              <p className="proposal-description">{proposal.description}</p>
              <div className="proposal-details">
                <span>Votes For: {Number(proposal.votesFor)}</span>
                <span>Votes Against: {Number(proposal.votesAgainst)}</span>
                <span>Voting Deadline: {new Date(Number(proposal.votingDeadline) * 1000).toLocaleString()}</span>
                <span>Status: Voting</span>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingProposals;
