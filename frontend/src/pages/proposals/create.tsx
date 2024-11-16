import React, { useState } from 'react';
import { writeContract } from "@wagmi/core";
import config from "../../wagmi"; 
import { ABI, deployedAddress } from "../../contracts/deployed-contract"; 
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'; 
import { useAccount } from 'wagmi';

const CreateProposal: React.FC = () => {
  const router = useRouter(); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, address } = useAccount(); 
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Returns format 'YYYY-MM-DDTHH:MM'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      toast.error("Connect your wallet to continue");
      setIsLoading(false); // Stop loading when the error occurs
      return; // Return early if not connected
    }
    setIsLoading(true);
    try {
      // const tx = await writeContract(config, {
      //   address: deployedAddress,
      //   abi: ABI,
      //   functionName: 'createProposal',
      //   args: [title, description, new Date(deadline).getTime() / 1000],
      // });
      const tx = await writeContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'createProposal',
        args: [title, description, BigInt(new Date(deadline).getTime() / 1000)], // Convert to bigint
    });
    
      toast.success('Proposal created successfully!');
      console.log('Transaction sent:', tx);
      router.push('/proposals/userproposals'); 
       
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error('Error creating proposal');
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
        <div><span><span>Set your voting deadline to provide sufficient time for community members to review and vote.<br/>
        Note: To secure funding or donations, your proposal must receive either an equal or greater number of "For" votes compared to "Against" votes.</span>
</span><br/><br/>
          <label>
            Voting Deadline:
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={getCurrentDateTime()}
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
