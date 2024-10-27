import React, { useState } from 'react';
import {
  useWriteDisasterReliefFundCreateProposal 
} from "../../contracts/generated";
import { useWaitForTransactionReceipt } from "wagmi";

const CreateProposal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Destructure the writeContractAsync function and transaction data
  const { data: txHash, writeContractAsync: writeProposal } =
    useWriteDisasterReliefFundCreateProposal();

  // Use useWaitForTransactionReceipt to monitor transaction confirmation
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tx = await writeProposal({
        args: [title, description],
      });
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Proposal</h1>
      <div>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" disabled={isLoading}>Create Proposal</button>
      {isSuccess && <p>Proposal created successfully!</p>}
      {isError && <p>There was an error confirming the transaction.</p>}
    </form>
  );
};

export default CreateProposal;
