// utils/fetchPendingProposals.ts
import fetchProposals from './fetchProposals'; // Import the existing function
import type { ProposalResponse } from '../types/proposals/types';

const fetchPendingProposals = async (): Promise<ProposalResponse[]> => {
  try {
    const allProposals = await fetchProposals(); // Get all proposals

    // Filter out the pending proposals
    const pendingProposals = allProposals.filter(proposal => 
      !proposal.executed && !proposal.archived
      // && Number(proposal.votingDeadline) * 1000 > Date.now() // Convert BigInt to number for comparison
    );

    return pendingProposals;
  } catch (error) {
    throw new Error(`Failed to fetch pending proposals: ${error}`);
  }
};

export default fetchPendingProposals;
