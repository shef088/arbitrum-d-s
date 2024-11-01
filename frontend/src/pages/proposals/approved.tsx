// pages/proposals/approved.tsx
import React, { useEffect, useState } from 'react';
import fetchProposals from "../../utils/fetchProposals";
import type { ProposalResponse } from "../../types/proposals/types";
import Link from 'next/link';
import { useAccount } from "wagmi";
 

const ApprovedProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount(); 

  useEffect(() => {
    const getApprovedProposals = async () => {
      setLoading(true);
      if (!isConnected || !address) return;

      try {
        const allProposals = await fetchProposals();
        const approvedProposals = allProposals.filter(p => p.executed && p.votesFor >= p.votesAgainst);
        setProposals(approvedProposals);
      } catch (err) {
        setError("Error fetching approved proposals");
      } finally {
        setLoading(false);
      }
    };

    getApprovedProposals();
  }, [isConnected, address]);

  if (loading) return <p className="loading-message">Loading approved proposals...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="proposals-container">
      <h2>Approved Proposals for Donations/Funding</h2>
      {proposals.length === 0 ? (
        <p>No approved proposals found.</p>
      ) : (
        proposals.map((proposal) => (
          <div className="inner-proposal" key={proposal.id}>
            <Link href={`/proposals/${proposal.id}`}>
              <h3 className="proposal-title">{proposal.title}</h3>
              <p className="proposal-description">{proposal.description}</p>
              <div className="proposal-details">
              
                <span>Donate</span>
              </div> 
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovedProposals;
