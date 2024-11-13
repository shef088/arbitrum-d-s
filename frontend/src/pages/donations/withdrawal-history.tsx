// WithdrawalHistory.tsx
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';  // Pagination component to control page changes
import Loader from '../../components/Loader';
import { ethers } from 'ethers';
import config from '../../wagmi';
import { readContract } from '@wagmi/core';
import { ABI, deployedAddress } from '../../contracts/deployed-contract';

interface Withdrawal {
  amount: string;
  proposalId: number;
  timestamp: number;
}

const WithdrawalHistory: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [start, setStart] = useState(0); // Start index for pagination
  const count = 5; // Number of items per page
  const [totalItems, setTotalItems] = useState(0); // Total items for pagination
  const [currentPage, setCurrentPage] = useState(0); // Track current page

  // Fetch withdrawals based on `start`, `count`
  const fetchWithdrawals = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet to continue");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { withdrawals: fetchedWithdrawals, totalWithdrawals } = await fetchUserWithdrawals(address, start, count);
      
      const formattedWithdrawals = fetchedWithdrawals.map((withdrawal) => ({
        amount: ethers.formatEther(withdrawal.amount),  // Format the amount in ETH
        proposalId: withdrawal.proposalId,
        timestamp: withdrawal.timestamp,
      }));

      setWithdrawals(formattedWithdrawals);
      setTotalItems(totalWithdrawals);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
      setError("Failed to fetch withdrawals.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchWithdrawals on initial load and whenever `start` changes
  useEffect(() => {
    fetchWithdrawals();
  }, [start, isConnected]);

  const fetchUserWithdrawals = async (address: string, start: number, count: number) => {
    try {
      const result = await readContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'getUserWithdrawals',
        args: [address as `0x${string}`, BigInt(start), BigInt(count)],
      });
  
      // Destructure the result from the contract into withdrawals and totalWithdrawals
      const withdrawals = result[0] as { amount: bigint, proposalId: bigint, timestamp: bigint }[];
      const totalWithdrawals = result[1] as bigint;
  
      return {
        withdrawals: withdrawals.map(w => ({
          amount: ethers.formatEther(w.amount),  // Convert amount from bigint to ETH
          proposalId: Number(w.proposalId),  // Convert proposalId from bigint to number
          timestamp: Number(w.timestamp),  // Convert timestamp from bigint to number
        })),
        totalWithdrawals: Number(totalWithdrawals),  // Convert totalWithdrawals from bigint to number
      };
    } catch (error) {
      console.error('Error fetching user withdrawals:', error);
      throw new Error('Failed to fetch withdrawals');
    }
  };
  
  // Handle page change
  const handlePageChange = (selectedPage: number) => {
    setStart(selectedPage * count);
    setCurrentPage(selectedPage); // Update the current page
  };

  if (loading) return <Loader />;
  if (error) return <div className="withdrawals-container"><div className="error-message">{error}</div></div>;

  return (
    <div className="withdrawals-container">
      <h2>Your Withdrawal History</h2>

      {withdrawals.length === 0 ? (
        <p>No withdrawals found.</p>
      ) : (
        <div className="withdrawal-list">
          {withdrawals.map((withdrawal, index) => (
            <div className="withdrawal-item" key={index}>
              <p>Proposal ID: {withdrawal.proposalId}</p>
              <p>Amount: {withdrawal.amount} ETH</p>
              <p>Timestamp: {new Date(withdrawal.timestamp * 1000).toLocaleString()}</p> {/* Convert timestamp to readable date */}
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <Pagination 
        count={count} 
        totalItems={totalItems} 
        onPageChange={handlePageChange} 
        currentPage={currentPage} // Pass currentPage to Pagination
      />
    </div>
  );
};

export default WithdrawalHistory;
