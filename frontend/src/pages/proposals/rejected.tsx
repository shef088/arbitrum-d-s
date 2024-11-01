// pages/proposals/rejected.tsx
import React, { useEffect, useState } from 'react';
import fetchProposals from "../../utils/fetchProposals";
import type { ProposalDetails, ProposalResponse } from "../../types/proposals/types";
import Link from 'next/link'; // Import Link
import { useAccount } from "wagmi";

const RejectedProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
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
        const rejectedProposals = allProposals.filter(p => p.votingPassed!==true);
        setProposals(rejectedProposals);
      } catch (err) {
        setError("Error fetching rejected proposals");
      } finally {
        setLoading(false);
      }
    };

    getRejectedProposals();
  }, [isConnected, address]);
  if (loading) return <div className="loading-message">Loading proposals...</div>;
  if (error) return <div className="error-message">{error}</div>;
  return (
    <div className="proposals-container">
      <h2>Rejected Proposals</h2>
      {proposals.length === 0 ? (
        <p>No approved proposals found.</p>
      ) : (proposals.map((proposal, index) => (
          <div className="inner-proposal" key={proposal.id}>
          <Link href={`/proposals/${proposal.id}`}>
       <h3 className="proposal-title">{proposal.title}</h3>
       <p className="proposal-description">{proposal.description}</p>
       <div className="proposal-details">
         <span>Votes For: {Number(proposal.votesFor)}</span>
         <span>Votes Against: {Number(proposal.votesAgainst)}</span>
         <span>Deadline: {new Date(Number(proposal.votingDeadline) * 1000).toLocaleString()}</span>
         <span>Status: {proposal.executed ? (proposal.votingPassed ? "Approved" : "Rejected") : "Voting"}</span>
  
       </div> 
     </Link>
   
     </div>
       
        ))
      )}
    </div>
  );
};

export default RejectedProposals;
