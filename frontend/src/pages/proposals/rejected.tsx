// pages/proposals/rejected.tsx
import React, { useEffect, useState } from 'react';
import fetchProposals from "../../utils/fetchProposals";
import type { ProposalDetails, ProposalResponse } from "../../types/proposals/types";
import Link from 'next/link'; // Import Link
import { useAccount } from "wagmi";
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const RejectedProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount(); 
  useEffect(() => {
    const getRejectedProposals = async () => {
      if (!isConnected || !address) {
        toast.error("Connect your wallet to continue");
        setLoading(false); // Stop loading when the error occurs
        return; // Return early if not connected
    }
      setLoading(true);
     
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
  if (loading) return <Loader/>;
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
