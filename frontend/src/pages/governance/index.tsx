import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { readContract } from '@wagmi/core';
import config from '../../wagmi';
import { ABI, deployedAddress } from '../../contracts/deployed-contract';
import { toast } from 'react-toastify';
 

const GovernancePage: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [governanceAddress, setGovernanceAddress] = useState('');
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [governanceAddresses, setGovernanceAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerAddress = async () => {
      try {
        const result = await readContract(config, {
          address: deployedAddress,
          abi: ABI,
          functionName: 'owner',
        });
        setOwnerAddress(result);
      } catch (error) {
        console.error('Failed to fetch owner address:', error);
        toast.error("Failed to fetch owner address")
      }
    };

    fetchOwnerAddress();
  }, []);

  useEffect(() => {
    if (ownerAddress && address) {
      setIsOwner(ownerAddress.toString().toLowerCase() === address.toLowerCase());
    }
  }, [ownerAddress, address]);

  const fetchGovernanceAddresses = async () => {
    setLoading(true);
    try {
      const addresses = await readContract(config, {
        address: deployedAddress,
        abi: ABI,
        functionName: 'getGovernanceAddresses',
      });
      setGovernanceAddresses([...addresses]);
    } catch (error) {
      console.error('Failed to fetch governance addresses:', error);
      setError('Failed to fetch governance addresses.');
      toast.error('Failed to fetch governance addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernanceAddresses();
  }, []);

  // Refetch governance addresses when account changes
  useEffect(() => {
    fetchGovernanceAddresses();
  }, [address]);

  const handleAddGovernanceAddress = async () => {
    if (!governanceAddress) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(deployedAddress, ABI, signer);

      const tx = await contract.authorizeGovernance(governanceAddress.trim());
      await tx.wait();
      toast.success('Governance address added successfully!');
      setGovernanceAddress('');
      await fetchGovernanceAddresses(); // Refresh addresses
    } catch (error) {
      console.error('Failed to add governance address:', error);
      toast.error('Failed to add governance address.');
    }
  };

  const handleRemoveGovernanceAddress = async (addressToRemove: string) => {
    const confirmation = window.confirm(`Are you sure you want to remove the governance address ${addressToRemove}?`);
    if (!confirmation) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(deployedAddress, ABI, signer);

      const tx = await contract.revokeGovernance(addressToRemove);
      await tx.wait();
      toast.success('Governance address removed successfully!');
      await fetchGovernanceAddresses(); // Refresh addresses
    } catch (error) {
      console.error('Failed to remove governance address:', error);
      toast.error('Failed to remove governance address.');
    }
  };

  return (
    <div className="governance-container">
      <h1>Governance Management</h1>
      {isOwner ? (
        <div className="input-group">
          <input
            type="text"
            value={governanceAddress}
            onChange={(e) => setGovernanceAddress(e.target.value)}
            placeholder="Enter governance address"
          />
          <button onClick={handleAddGovernanceAddress}>Add Governance Address</button>
        </div>
      ) : (
        <p className="message">You do not have permission to manage governance addresses.</p>
      )}
      <div className="governance-addresses">
        <h2>Current Governance Addresses</h2>
        {loading ? (
          <p>Loading governance addresses...</p>
        ) : error ? (
          <p>{error}</p>
        ) : governanceAddresses.length === 0 ? (
          <p>No governance addresses found.</p>
        ) : (
          <ul>
            {governanceAddresses.map((addr, index) => (
              <li key={index}>
                {addr}
                {isOwner && (
                  <button className="remove-button" onClick={() => handleRemoveGovernanceAddress(addr)}>Remove</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="note">Manage your governance addresses with care.</div>
    </div>
  );
};

export default GovernancePage;
