// components/Header.tsx
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useAccountEffect } from "wagmi";
import { toast } from 'react-toastify';

const Header: React.FC = () => {
    const { isConnected } = useAccount();
    const [account, setAccount] = useState<string | undefined>(undefined);

    useAccountEffect({
        onConnect(data) {
            console.log("account::", data)
            setAccount(data.address);
            toast.success("Account connected");
        },
        onDisconnect() {
            console.log("Account Disconnected");
            toast.error("Account Disconnected");
            setAccount(undefined);
        },
    });

    return (
        <header className="header">
            <div className="logo">
                <h1>Disaster Relief Fund</h1>
            </div>
            <div className="connect-btn">
                <ConnectButton />
            </div>
            <nav className="navigation">
                <Link href="/">Home</Link>
                {isConnected && (
                    <>
                        <Link href="/proposals/create">Create Proposal</Link>
                        {/* <Link href="/proposals">View Proposals</Link> */}
                        <Link href="/proposals/pending">Vote on Proposals</Link>
                        <Link href="/proposals/approved">Approved Proposals</Link>
                        <Link href="/proposals/rejected">Rejected Proposals</Link>
                        <Link href="/proposals/userproposals">Your Proposals</Link>
                        <Link href="/proposals/advanced-ops">Advanced</Link>   
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
