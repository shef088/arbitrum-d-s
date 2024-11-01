import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useAccountEffect } from "wagmi";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
    const { isConnected } = useAccount();
    const [account, setAccount] = useState<string | undefined>(undefined);
    const router = useRouter();

    useAccountEffect({
        onConnect(data) {
            setAccount(data.address);
            toast.success("Account connected");
        },
        onDisconnect() {
            toast.error("Account Disconnected");
            setAccount(undefined);
        },
    });

    const isActive = (path: string) => router.pathname === path;

    return (
        <header className="header">
            <div className="logo">
                <h1>Disaster Relief Fund</h1>
            </div>
            <div className="connect-btn">
                <ConnectButton />
            </div>
            <nav className="navigation">
                <Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                {isConnected && (
                    <>
                        <Link href="/proposals/create" className={isActive('/proposals/create') ? 'active' : ''}>Create Proposal</Link>
                        <Link href="/proposals/pending" className={isActive('/proposals/pending') ? 'active' : ''}>Vote on Proposals</Link>
                        <Link href="/proposals/approved" className={isActive('/proposals/approved') ? 'active' : ''}>Approved Proposals</Link>
                        <Link href="/proposals/rejected" className={isActive('/proposals/rejected') ? 'active' : ''}>Rejected Proposals</Link>
                        <Link href="/proposals/userproposals" className={isActive('/proposals/userproposals') ? 'active' : ''}>My Proposals</Link>
                        <Link href="/donations/user-donations" className={isActive('/donations/user-donations') ? 'active' : ''}>My Donations</Link>
                        <Link href="/proposals/advanced-ops" className={isActive('/proposals/advanced-ops') ? 'active' : ''}>Advanced</Link>
                        <Link href="/governance" className={isActive('/governance') ? 'active' : ''}>Governance</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
