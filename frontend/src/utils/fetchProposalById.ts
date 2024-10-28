// utils/fetchProposalById.ts
import { readContract } from '@wagmi/core';
import config from "../wagmi";
import { ABI, deployedAddress } from "../contracts/deployed-contract";
import type { ProposalDetails, ProposalResponse } from "../types/proposals/types";

const fetchProposalById = async (id: number): Promise<ProposalResponse | null> => {
  try {
    // Fetch the specific proposal by its ID from the smart contract
    const proposal: ProposalDetails = await readContract(config, {
      address: deployedAddress,
      abi: ABI,
      functionName: 'getProposal',
      args: [BigInt(id)], // Convert ID to BigInt
    }) as ProposalDetails;

    // Return the proposal with an ID field
    return { ...proposal, id }; // Add the ID to the returned object
  } catch (error) {
    console.error("Error fetching proposal by ID:", error);
    throw new Error("Failed to fetch proposal details");
  }
};

export default fetchProposalById;
