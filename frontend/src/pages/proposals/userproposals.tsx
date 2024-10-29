// components/UserProposals.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import fetchUserProposals from '../../utils/fetchUserProposals';
import type { ProposalResponse } from '../../types/proposals/types';
import { useAccount } from "wagmi";
import { toast } from 'react-toastify';


const UserProposals: React.FC = () => {
  const { isConnected, address } = useAccount(); 
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserProposals = async () => {
      if (!isConnected || !address) {
        // toast.error("Account disconnected!");
        return; 
      }

      try {
        const userProposals = await fetchUserProposals(address);
        setProposals(userProposals);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user proposals.");
      } finally {
        setLoading(false);
      }
    };

    getUserProposals();
  }, [isConnected, address]);

  if (loading) return <div>Loading proposals...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="user-proposals-container">
      <h1>Your Proposals</h1>
      {proposals.length === 0 ? (
        <p>No proposals found for this user.</p>
      ) : (
        <ul>
          {proposals.map(proposal => (
            <li key={proposal.id}>
              <Link href={`/proposals/${proposal.id}`}>
                <h2>{proposal.title}</h2>
                <p>{proposal.description}</p>
                <p>Votes For: {proposal.votesFor.toString()}</p>
                <p>Votes Against: {proposal.votesAgainst.toString()}</p>
                <p>Deadline: {new Date(Number(proposal.deadline)).toLocaleString()}</p>
                <p>Executed: {proposal.executed ? 'True' : 'False'}</p>
                <p>Status: {proposal.passed ? 'Passed' : 'Not Passed'}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProposals;
