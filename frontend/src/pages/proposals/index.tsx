import React, { useEffect, useState } from 'react';
import { readContract } from "@wagmi/core";
import config from "../../wagmi"; // Adjust the import according to your project structure
import { ABI, deployedAddress } from "../../contracts/deployed-contract"; // Adjust as needed
import type { ProposalDetails } from "../../types/proposals/types"; // Adjust according to your type definition

const ProposalsList: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true); // Ensure loading state is set
      try {
        const proposalCount: bigint = await readContract(config, {
          abi: ABI,
          address: deployedAddress,
          functionName: "proposalCount",
          args: [],
        });
 console.log("proposalCount:",proposalCount)
        const proposalPromises: Promise<ProposalDetails | undefined>[] = [];

        for (let i = 1; i <= Number(proposalCount); i++) { // Adjust loop to start from 1
          const proposal: Promise<ProposalDetails | undefined> = readContract(config, {
            abi: ABI,
            address: deployedAddress,
            functionName: "getProposal",
            args: [BigInt(i)], // Assuming your proposals are indexed from 1
          });
          proposalPromises.push(proposal);
        }

        const proposalResults = await Promise.all(proposalPromises);
        const validProposals = proposalResults.filter((proposal): proposal is ProposalDetails => !!proposal);

        setProposals(validProposals);
      } catch (err) {
        console.error(err); // Log error for debugging
        setError("Error fetching proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  if (loading) {
    return <p>Loading proposals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>All Proposals</h2>
      {proposals.map((proposal, index) => (
        <div key={index}>
          <h3>{proposal.title}</h3>
          <p>{proposal.description}</p>
          <p>Votes For: {proposal.votesFor}</p>
          <p>Votes Against: {proposal.votesAgainst}</p>
          <p>Deadline: {new Date(proposal.deadline * 1000).toLocaleString()}</p> {/* Convert timestamp */}
          <p>Status: {proposal.executed ? "Executed" : "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

export default ProposalsList;
