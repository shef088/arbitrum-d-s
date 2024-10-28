// pages/proposals/approved.tsx
import React, { useEffect, useState } from 'react';
import   fetchProposals  from "../../utils/fetchProposals";
import type { ProposalDetails } from "../../types/proposals/types";

const ApprovedProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getApprovedProposals = async () => {
      setLoading(true);
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
  }, []);

  return (
    <div>
      <h2>Approved Proposals</h2>
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        proposals.map((proposal, index) => (
          <div key={index}>
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <p>Votes For: {Number(proposal.votesFor)}</p>
            <p>Votes Against: {Number(proposal.votesAgainst)}</p>
            <p>Status: Executed</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovedProposals;
