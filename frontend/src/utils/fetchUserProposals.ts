// utils/fetchUserProposals.ts
import { readContract } from '@wagmi/core';
import config from "../wagmi";
import { ABI, deployedAddress } from "../contracts/deployed-contract";
import type { ProposalDetails, ProposalResponse } from "../types/proposals/types";

/**
 * Fetches all proposals created by a specific user.
 * 
 * @param userAddress - The address of the user to filter proposals by
 * @returns A list of proposals created by the user
 */
const fetchUserProposals = async (userAddress: string): Promise<ProposalResponse[]> => {
  const userProposals: ProposalResponse[] = [];

  try {
    // Fetch the proposal IDs created by the user
    const proposalIds: BigInt[] = await readContract(config, {
      address: deployedAddress,
      abi: ABI,
      functionName: 'getUserProposals',
      args: [userAddress],
    }) as BigInt[];

    // Fetch details for each proposal using the proposal IDs
    for (const id of proposalIds) {
      const proposal: ProposalDetails = await readContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'getProposal',
        args: [id],
      }) as ProposalDetails;

      userProposals.push({ ...proposal, id: Number(id) }); // Add an ID field
    }

    return userProposals;
  } catch (error) {
    console.error("Error fetching user proposals:", error);
    throw new Error("Failed to fetch user proposals");
  }
};

export default fetchUserProposals;
