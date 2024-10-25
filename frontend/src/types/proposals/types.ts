// types/proposal/types.ts

export interface Proposal {
  proposer: string;         // Address of the proposer
  title: string;           // Title of the proposal
  description: string;     // Description of the proposal
  votesFor: number;        // Number of votes in favor
  votesAgainst: number;    // Number of votes against
  deadline: number;        // Voting deadline (timestamp)
  executed: boolean;       // Status of proposal execution
}

// Type for the response from the contract
export type ProposalResponse = Proposal & { id: number }; // Includes an ID for the proposal
