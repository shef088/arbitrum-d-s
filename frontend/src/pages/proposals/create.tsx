import React, { useState } from 'react';
import { useWaitForTransactionReceipt } from "wagmi";
import { writeContract } from "@wagmi/core"; // Ensure this import is correct
import config from "../../wagmi"; // Adjust import as necessary
import { ABI, deployedAddress } from "../../contracts/deployed-contract"; // Adjust import as necessary

const CreateProposal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null); // State for transaction hash
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [isError, setIsError] = useState(false); // State for error status
  const [isSuccess, setIsSuccess] = useState(false); // State for success status

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    try {
      const tx = await writeContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'createProposal', // Adjust function name as necessary
        args: [title, description],
      });
      console.log('Transaction sent:', tx);
      setTxHash(tx.hash); // Store the transaction hash for monitoring
    } catch (error) {
      console.error('Error creating proposal:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Use useWaitForTransactionReceipt to monitor transaction confirmation
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: !!txHash, // Only monitor if txHash is available
  });

  if (txSuccess && !isSuccess) {
    setIsSuccess(true);
    alert('Proposal created successfully!');
  }

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
      {isLoading && <p>Creating proposal, please wait...</p>}
      {isError && <p style={{ color: 'red' }}>There was an error confirming the transaction.</p>}
    </form>
  );
};

export default CreateProposal;
