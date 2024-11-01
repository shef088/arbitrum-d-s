import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import fetchProposalById from '../../utils/fetchProposalById';
import { readContract, writeContract } from "@wagmi/core"; 
import config from "../../wagmi"; 
import { ABI, deployedAddress } from "../../contracts/deployed-contract"; 
import type { ProposalResponse } from '../../types/proposals/types'; 
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { ContractFunctionExecutionError } from 'viem';

const ProposalDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [proposal, setProposal] = useState<ProposalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [donationAmountETH, setDonationAmountETH] = useState<string>("");
  const [donationAmountUSD, setDonationAmountUSD] = useState<string>("");
  const [ethToUsdRate, setEthToUsdRate] = useState<number | null>(null);
  const { isConnected, address } = useAccount(); 
  const [countdown, setCountdown] = useState<number>(0); // Countdown state

  useEffect(() => {
    // Fetch ETH to USD exchange rate
    const fetchEthToUsdRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setEthToUsdRate(data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching ETH to USD rate:', error);
      }
    };

    fetchEthToUsdRate();
  }, []);

  useEffect(() => {
  
    getProposalDetails();
  }, [id, isConnected, address]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);
  const getProposalDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const proposalId = Number(id);
      const foundProposal = await fetchProposalById(proposalId);
      if (foundProposal) {
        console.log("foundProposal::", foundProposal);
        setProposal(foundProposal);
        
        // Convert BigInt to number safely
        const currentTime = Math.floor(Date.now() / 1000);
        const propDeadline = Number(foundProposal.votingDeadline); // Convert to number
        
        // Calculate remaining time
        const remainingTime = propDeadline - currentTime;
        setCountdown(remainingTime > 0 ? remainingTime : 0); // Set countdown in seconds
 
      } else {
        setError('Proposal not found');
      } 
    } catch (err ) {
     
      if (err  instanceof ContractFunctionExecutionError) {
       
        const reason = err.message.includes("Proposal does not exist") 
            ? `Proposal with id '${Number(id)}' does not exist.`
            : "Error fetching proposal.";
         
        toast.error(reason);
        setError(reason);
      }else{
        setError((err as Error).message);
      }
       
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteFor: boolean) => {
    if (!proposal) return;
    setVoteError(null);
    if (Date.now() >= Number(proposal.votingDeadline) * 1000) {
      setVoteError('Voting period has ended for this proposal.');
      return;
    }

    try {
      const proposalId: bigint = BigInt(Number(id));
      await writeContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'vote',
        args: [proposalId, voteFor],
      });

      toast.success(`Successfully voted ${voteFor ? 'for' : 'against'} proposal ${proposal.title}`);
 // Refresh proposal data  
      const foundProposal = await getProposalDetails()
     
      
    } catch (err) {
      console.error("Error voting:", err);
      setVoteError("Error casting your vote");
      if (err instanceof ContractFunctionExecutionError) {
        const reason = err.message.includes("Already voted") 
            ? "You have already voted with this choice for this proposal."
            : "Error casting your vote.";
        setVoteError(reason);
        toast.error(reason);
      }
    }
  };
 
  const handleDonate = async () => {
    if (!proposal || !donationAmountETH || parseFloat(donationAmountETH) < 0.00001) {
      toast.error("Donation must be greater than 0.00001 ETH");
      return;
    }

    try {
    
      const ethAmount = ethers.parseEther(donationAmountETH); // Ensure it's correctly formatted for ETH
      const proposalId: bigint = BigInt(Number(id));
      await writeContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'donateToProposal',
        args: [proposalId],
        value: ethAmount,
      });

      toast.success(`Successfully donated ${donationAmountETH} ETH to proposal ${proposal.title}`);
      setDonationAmountETH("");
      setDonationAmountUSD("");

      // Refresh proposal data 
      const foundProposal = await getProposalDetails()

    } catch (err) {
      console.error("Error donating:", err);
      toast.error("Error processing donation");
    }
  };

  const handleEthChange = (ethAmount: string) => {
    const amount = parseFloat(ethAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Invalid donation amount");
      return;
    }
    setDonationAmountETH(ethAmount);
  
    if (ethToUsdRate) {
      setDonationAmountUSD((amount * ethToUsdRate).toFixed(2));
    }
  };
  
  const handleUsdChange = (usdAmount: string) => {
    setDonationAmountUSD(usdAmount);
    if (ethToUsdRate) {
      setDonationAmountETH((parseFloat(usdAmount) / ethToUsdRate).toFixed(6));
    }
  };

  const handleCheckExpiredAndExecute = async () => {
    if (!proposal) return;
    
        try {
          const proposalId: bigint = BigInt(Number(id));
            await writeContract(config, {
                address: deployedAddress,
                abi: ABI,
                functionName: 'executeProposal',
                args: [proposalId],
            });

            toast.success(`Executed proposal ${proposal.title} successfully!.`);
             // Refresh proposal  
            const foundProposal = await getProposalDetails();
        } catch (err) {
            console.error("Error executing proposal:", err);
            console.error("Error executing msg:", err);
            if (err instanceof ContractFunctionExecutionError) {
              const reason = err.message.includes("Voting period not ended") 
                  ? "Voting period not ended. Wait till it ends to Execute!."
                  : "Error Executing";
               
              toast.error(reason);
            }
        }
    
};

const handleArchive = async () => {
  if (!proposal) return;
  const confirmation = window.confirm("Are you sure you want to archive this proposal?");
   if (!confirmation) return;
  try {
    const proposalId: bigint = BigInt(Number(id));
    
    await writeContract(config, {
      address: deployedAddress,
      abi: ABI,
      functionName: 'archiveProposal', // Function to archive the proposal
      args: [proposalId],
    });

    toast.success(`Successfully archived proposal ${proposal.title}`);
    // Refresh proposal data 
    const foundProposal = await getProposalDetails();
  } catch (err) {
    console.error("Error archiving proposal:", err);
    if (err instanceof ContractFunctionExecutionError) {
      const reason = err.message.includes("Cannot archive this proposal") 
          ? "This proposal cannot be archived."
          : "Error archiving proposal.";
      toast.error(reason);
    }
  }
};

const recreateProposal = async( ) => {
  if (!proposal) return;

  try {
    const proposalId: bigint = BigInt(Number(id));
    
    await writeContract(config, {
      address: deployedAddress,
      abi: ABI,
      functionName: 'recreateProposal',  
      args: [proposalId],
    });

    toast.success(`Successfully recreated proposal ${proposal.title}`);
    // Refresh proposal data 
    const foundProposal = await getProposalDetails();
  } catch (err) {
    console.error("Error recreating proposal:", err);
     
  }
}
  if (loading) return <p>Loading proposal details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!proposal) return <p>No proposal data available.</p>;

  return (
    <div className="proposal-detail-container">
      <h2>Proposal Details</h2>
      <div className="proposal-detail">
        <h2>{proposal.title}</h2>
        <p>Description: {proposal.description}</p>
        
        <hr/>
     
        {!proposal.archived && !proposal.executed &&  (
    <>
        Voting Deadline: <b>{new Date(Number(proposal.votingDeadline) * 1000).toLocaleString()}</b>
        <br />
        Voting Deadline Countdown: 
        <span className='countdown'>
            {countdown > 0 ? `${Math.floor(countdown / 3600)}h ${Math.floor((countdown % 3600) / 60)}m ${countdown % 60}s` : "Expired"}
        </span> 
        <hr />
        <br />
     


      <ul>
        <li>Note: This proposal will only be eligible to receive donations or funding if the votesfor is equal to or greater than the votesagainst.</li>
        </ul>      </>
)}
        <div className="proposal-stats">
          {!proposal.executed && <>
          <p>Votes For: {Number(proposal.votesFor)}</p>
          <p>Votes Against: {Number(proposal.votesAgainst)}</p>
          </>}
         
     
          <p>Status: 
  {proposal.archived 
    ? "Archived(Cannot receive votes or donations!)" 
    : proposal.executed 
      ? (proposal.votingPassed ? "Approved for Donations/Funding" : "Rejected") 
      : "Voting"}
</p>


          <p>
            Funds Received: <span className="funds-p"> {proposal.fundsReceived ? ethers.formatEther(proposal.fundsReceived) : "0"} ETH 
            ({proposal.fundsReceived ? (parseFloat(ethers.formatEther(proposal.fundsReceived)) * (ethToUsdRate || 0)).toFixed(2) : "0"} USD)
            </span>
          </p>
           </div>
           <div className="vote-buttons">
  {!proposal.executed && Date.now() < Number(proposal.votingDeadline) * 1000 && (
    <>
      <button onClick={() => handleVote(true)} className="up-vote-btn">
        <FaArrowUp className="vote-icon" /> {Number(proposal.votesFor)}
      </button>
      <button onClick={() => handleVote(false)} className="down-vote-btn">
        <FaArrowDown className="vote-icon" /> {Number(proposal.votesAgainst)}
      </button>
    </>
  )}
</div>

        {voteError && <p className="error">{voteError}</p>}
        {proposal.votingPassed &&(

       
        <div className="donate-section">
          <h3>Donate to this Proposal</h3>
          <div>
          
              <div className=''>  <label htmlFor="amounteth">ETH </label>
            <input
              name="amounteth"
              type="number"
              min="0"
              value={donationAmountETH}
              onChange={(e) => handleEthChange(e.target.value)}
              placeholder="0.00"
            /></div>
            <div className=''>    <label htmlFor="amountusd">USD </label>
            <input
              name="amountusd"
              type="number"
              min="0"
              value={donationAmountUSD}
              onChange={(e) => handleUsdChange(e.target.value)}
              placeholder="0.00"
            /></div>
        
            <button onClick={handleDonate}>Donate</button>
          </div>
        </div>
         )}
         {!proposal.executed && !proposal.archived  && <div className="check-exp">
         <span>Execute if this proposal's voting period has ended but proposal status is still Voting.(triggers execute if expired)</span>
            <button onClick={handleCheckExpiredAndExecute}>Execute Proposal</button>
        </div>}
        {proposal.proposer === address && !proposal.archived && (
   <div className="archive-section">
   <span>Equivalent to set proposal inactive</span>
   <button onClick={handleArchive}>Archive Proposal</button>
 </div>
         )}
          {proposal.archived &&(
        <div className="check-exp">

            <button onClick={()=>recreateProposal()}>Recreate Proposal</button>
        </div>
         )}
         
      </div>
    </div>
  );
};

export default ProposalDetail;
