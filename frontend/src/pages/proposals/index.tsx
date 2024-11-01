 

import React, { useEffect, useState } from "react";
 
import type { ProposalDetails } from "../../types/proposals/types";
import fetchProposals from "../../utils/fetchProposals";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

const ProposalsList: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useAccount();
  useEffect(() => {
    const loadProposals = async () => {
      if (!isConnected || !address) {
        toast.error("Connect your wallet to continue");
        setLoading(false); // Stop loading when the error occurs
        return; // Return early if not connected
    }
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

  if (loading) return <Loader/>;
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
          <p>Deadline: {new Date(Number(proposal.votingDeadline) * 1000).toLocaleString()}</p>
          <p>Status: {proposal.executed ? "Executed" : "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default ProposalsList;
