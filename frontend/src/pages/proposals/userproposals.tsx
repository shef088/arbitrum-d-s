// components/UserProposals.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import fetchUserProposals from '../../utils/fetchUserProposals';
import type { ProposalResponse } from '../../types/proposals/types';
import { useAccount } from "wagmi";
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const UserProposals: React.FC = () => {
  const { isConnected, address } = useAccount(); 
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserProposals = async () => {
      
      if (!isConnected || !address) {
        toast.error("Connect your wallet to continue");
        setLoading(false); // Stop loading when the error occurs
        return; // Return early if not connected
    }
    setLoading(true)
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

  if (loading) return <Loader/>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="proposals-container">
      <h1>Your Proposals</h1>
      {proposals.length === 0 ? (
        <p>No proposals found for this user.</p>
      ) : (
        <ul>
          {proposals.map(proposal => ( 
            <div className="inner-proposal" key={proposal.id}>
                 <Link href={`/proposals/${proposal.id}`}>
              <h3 className="proposal-title">{proposal.title}</h3>
              <p className="proposal-description">{proposal.description}</p>
              <div className="proposal-details">
                <span>Votes For: {Number(proposal.votesFor)}</span>
                <span>Votes Against: {Number(proposal.votesAgainst)}</span>
                <span>Voting Deadline: {new Date(Number(proposal.votingDeadline) * 1000).toLocaleString()}</span>
                <span>
  Status: {proposal.archived 
    ? "Archived" 
    : proposal.executed 
      ? (proposal.votingPassed ? "Approved for Donations" : "Rejected") 
      : "Voting"
  }
</span>

         
              </div> 
            </Link>
          
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProposals;
