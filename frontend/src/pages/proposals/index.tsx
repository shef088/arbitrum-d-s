import React, { useEffect, useState } from 'react';
import { readContract } from "@wagmi/core";
import config from "../../wagmi"; // Ensure this import is correct
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import type { ProposalDetails } from "../../types/proposals/types";

const ProposalsList: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        // Fetch the number of proposals
        const proposalCount = await readContract(config, {
          address: deployedAddress,
          abi: ABI,
          functionName: "proposalCount",
        });

        console.log("proposalCount:", proposalCount);
        const proposalPromises: Promise<ProposalDetails | undefined>[] = [];

        // Use BigInt consistently
        const count = proposalCount; // Keep proposalCount as BigInt
        for (let i = BigInt(1); i <= count; i++) {
          const proposal = readContract(config, {
            address: deployedAddress,
            abi: ABI,
            functionName: "getProposal",
            args: [i], // Pass i directly as BigInt
          }) as Promise<ProposalDetails | undefined>;
          proposalPromises.push(proposal);
        }

        const proposalResults = await Promise.all(proposalPromises);
        const validProposals = proposalResults.filter((p): p is ProposalDetails => p !== undefined);
        console.log("valid proposals:", validProposals)
        setProposals(validProposals);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        console.error("Error Message:", err.message);
        setError("Error fetching proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
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
