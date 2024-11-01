// pages/user-donations.tsx
import { useEffect, useState } from 'react';
import { readContract } from "@wagmi/core";
import config from "../../wagmi";
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import Link from 'next/link';


interface Donation {
    amount: string;
    proposalId: number;
}

const UserDonations = () => {
    const { address } = useAccount();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDonations = async () => {
            if (address) {
                try {
                    const userDonations = await readContract(config, {
                        address: deployedAddress,
                        abi: ABI,
                        functionName: 'getUserDonations',
                        args: [address as `0x${string}`],
                    }) as readonly { amount: bigint; proposalId: bigint; }[];

                    const formattedDonations = userDonations.map(donation => ({
                        amount: donation.amount.toString(),
                        proposalId: Number(donation.proposalId),
                    }));

                    setDonations(formattedDonations);
                } catch (error) {
                    console.error("Error fetching donations:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserDonations();
    }, [address]);

    if (loading) {
        return <div>Loading your donations...</div>;
    }

    return (
        <div className="user-donations-container">
            <h1>Your Donations</h1>
            {donations.length === 0 ? (
                <p className="no-donations">You have not made any donations yet.</p>
            ) : (
                <div className="donation-list">
                    {donations.map((donation, index) => (

                        <Link href={`/proposals/${donation.proposalId}`} key={donation.proposalId} className="donation-item">
                            <p>Proposal ID: {donation.proposalId}</p>
                            <p>Donation Amount: {ethers.formatEther(donation.amount)} ETH</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDonations;
