 

import React, { useEffect, useState } from "react";
 
import type { ProposalDetails } from "../../types/proposals/types";
import fetchProposals from "../../utils/fetchProposals";

const ProposalsList: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProposals = async () => {
      setLoading(true);
      try {
        const proposalsData = await fetchProposals();
        setProposals(proposalsData);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError("Error fetching proposals");
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, []);

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>All Proposals</h2>
      {proposals.map((proposal, index) => (
        <div key={index}>
          <h3>{proposal.title}</h3>
          <p>{proposal.description}</p>
          <p>Votes For: {Number(proposal.votesFor)}</p> {/* Convert to number */}
          <p>Votes Against: {Number(proposal.votesAgainst)}</p> {/* Convert to number */}
          <p>Deadline: {new Date(Number(proposal.deadline) * 1000).toLocaleString()}</p>
          <p>Status: {proposal.executed ? "Executed" : "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default ProposalsList;
