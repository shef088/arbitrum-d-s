// pages/pendingProposals.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import fetchPendingProposals from '../../utils/fetchPendingProposals';
import type { ProposalResponse } from '../../types/proposals/types';

const PendingProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const getPendingProposals = async () => {
      setLoading(true);
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
  }, []);

  const handleProposalClick = (proposalId: number) => {
    router.push(`/proposals/${proposalId}`); // Navigate to the proposal details page
  };

  if (loading) return <p>Loading pending proposals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Pending Proposals</h2>
      {proposals.length === 0 ? (
        <p>No pending proposals available.</p>
      ) : (
        <ul>
          {proposals.map((proposal) => (
            <li key={proposal.id} onClick={() => handleProposalClick(proposal.id)} style={{ cursor: 'pointer' }}>
              <h3>{proposal.title}</h3>
              <p>{proposal.description}</p>
              <p>Votes For: {Number(proposal.votesFor)}</p>
              <p>Votes Against: {Number(proposal.votesAgainst)}</p>
              <p>Deadline: {new Date(Number(proposal.deadline) * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingProposals;
