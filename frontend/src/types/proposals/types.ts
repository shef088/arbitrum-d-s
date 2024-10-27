// types/proposal/types.ts

export interface ProposalDetails {
  proposer: string;         // Address of the proposer
  title: string;            // Title of the proposal
  description: string;      // Description of the proposal
  votesFor: bigint;         // Count of votes in favor
  votesAgainst: bigint;     // Count of votes against
  deadline: bigint;         // Timestamp for the proposal deadline
  executed: boolean;        // Status of proposal execution
}


// Type for the response from the contract
export type ProposalResponse = ProposalDetails & { id: number }; // Includes an ID for the proposal
