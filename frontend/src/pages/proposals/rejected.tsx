// pages/proposals/rejected.tsx
import React, { useEffect, useState } from 'react';
import fetchProposals from "../../utils/fetchProposals";
import type { ProposalDetails } from "../../types/proposals/types";
import Link from 'next/link'; // Import Link
import { useAccount } from "wagmi";

const RejectedProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount(); 
  useEffect(() => {
    const getRejectedProposals = async () => {
      setLoading(true);
      if (!isConnected || !address) {
        
        return; 
      }
      try {
        const allProposals = await fetchProposals();
        const rejectedProposals = allProposals.filter(p => p.executed && p.votesFor <= p.votesAgainst);
        setProposals(rejectedProposals);
      } catch (err) {
        setError("Error fetching rejected proposals");
      } finally {
        setLoading(false);
      }
    };

    getRejectedProposals();
  }, [isConnected, address]);

  return (
    <div className="rejected-proposals-container">
      <h2>Rejected Proposals</h2>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : proposals.length === 0 ? (
        <p>No rejected proposals found.</p> // Message for empty list
      ) : (
        proposals.map((proposal, index) => (
          <div className="rejected-proposal" key={index}>
            <Link href={`/proposals/${proposal.id}`}>
            <h3>
              {proposal.title} 
            </h3>
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

export default RejectedProposals;
