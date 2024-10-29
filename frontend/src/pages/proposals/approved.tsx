// pages/proposals/approved.tsx
import React, { useEffect, useState } from 'react';
import fetchProposals from "../../utils/fetchProposals";
import type { ProposalDetails } from "../../types/proposals/types";
import Link from 'next/link';
import { useAccount } from "wagmi";

const ApprovedProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount(); 
  useEffect(() => {
    const getApprovedProposals = async () => {
      setLoading(true);
      if (!isConnected || !address) {
        
        return; 
      }
      try {
        const allProposals = await fetchProposals();
        const approvedProposals = allProposals.filter(p => p.executed && p.votesFor > p.votesAgainst);
        setProposals(approvedProposals);
      } catch (err) {
        setError("Error fetching approved proposals");
      } finally {
        setLoading(false);
      }
    };

    getApprovedProposals();
  }, [isConnected, address]);

  return ( 
    <div className="approved-proposals-container">
      <h2>Approved Proposals</h2>
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : proposals.length === 0 ? (
        <p>No approved proposals found.</p>  
      ) : (
        proposals.map((proposal, index) => (
          <div className="approved-proposal" key={index}>
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

export default ApprovedProposals;
