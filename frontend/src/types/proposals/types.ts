// types/proposal/types.ts

export interface ProposalDetails {
  // id: number ;             //roposal ID
  proposer: string;         // Address of the proposer
  title: string;            // Title of the proposal
  description: string;      // Description of the proposal
  votesFor: bigint;         // Count of votes in favor
  votesAgainst: bigint;     // Count of votes against
  votingDeadline: bigint;         // Timestamp for the proposal deadline
  executed: boolean;        // Status of proposal execution
  votingPassed: boolean;          // Status indicating if the proposal has passed
  fundsReceived: bigint;   //Amount donated to the proposal
  archived: boolean;     //Set proposal inactivve,cannott receive votes or donations if true
}


// Type for the response from the contract
// export type ProposalResponse = ProposalDetails ;  
export type ProposalResponse = ProposalDetails & { id: number };  
