// components/CreateProposal.tsx
import React, { useState } from 'react';
import { writeContract } from "@wagmi/core";
import config from "../../wagmi"; 
import { ABI, deployedAddress } from "../../contracts/deployed-contract"; 
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'; 


const CreateProposal: React.FC = () => {
  const router = useRouter(); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tx = await writeContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'createProposal',
        args: [title, description],
      });
      toast.success('Proposal created successfully!');
      console.log('Transaction sent:', tx);
 
      // Navigate to the user proposals page
      router.push('/proposals/userproposals');  

    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error('Error creating proposal: ' + error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="create-proposal-container">
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
      </form>
    </div>
  );
};

export default CreateProposal;
