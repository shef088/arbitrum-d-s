import { readContract } from '@wagmi/core';
import config from '../wagmi';
import { ABI, deployedAddress } from '../contracts/deployed-contract';
import type { ProposalDetails, ProposalResponse } from '../types/proposals/types';

interface PaginatedProposalResponse {
  proposals: ProposalResponse[];
  totalProposals: number;
}

/**
 * Fetch paginated executed proposals
 * @param start - Starting index for pagination
 * @param count - Number of proposals to fetch
 * @returns Array of executed proposals and the total number of executed proposals
 */
export const fetchExecutedProposals = async (start: number, count: number): Promise<PaginatedProposalResponse> => {
  try {
    // Destructure the result directly
    const [proposals, totalExecuted] = await readContract(config, {
      address: deployedAddress,
      abi: ABI,
      functionName: 'getExecutedProposals',
      args: [BigInt(start), BigInt(count)],
    }) as [ProposalResponse[], bigint];

    // Filter out proposals with id <= 0
    const filteredProposals = proposals.filter(proposal => proposal.id > 0);

    console.log("Filtered proposals:", filteredProposals);

    return { proposals: filteredProposals, totalProposals: Number(totalExecuted) };
  } catch (error) {
    console.error('Error fetching executed proposals:', error);
    throw new Error('Failed to fetch executed proposals');
  }
};

/**
 * Fetch paginated non-executed proposals
 * @param start - Starting index for pagination
 * @param count - Number of proposals to fetch
 * @returns Array of non-executed proposals and the total number of non-executed proposals
 */
export const fetchNonExecutedProposals = async (start: number, count: number): Promise<PaginatedProposalResponse> => {
  try {
    // Destructure the result directly
    const [proposals, totalNonExecuted] = await readContract(config, {
      address: deployedAddress,
      abi: ABI,
      functionName: 'getNonExecutedProposals',
      args: [BigInt(start), BigInt(count)],
    }) as [ProposalResponse[], bigint];

    // Filter out proposals with id <= 0
    const filteredProposals = proposals.filter(proposal => proposal.id > 0);

    console.log("Filtered proposals:", filteredProposals);

    return { proposals: filteredProposals, totalProposals: Number(totalNonExecuted) };
  } catch (error) {
    console.error('Error fetching non-executed proposals:', error);
    throw new Error('Failed to fetch non-executed proposals');
  }
};
