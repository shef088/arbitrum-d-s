import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useAccountEffect } from "wagmi";
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Header: React.FC = () => {
    const { isConnected } = useAccount();
    const [account, setAccount] = useState<string | undefined>(undefined);
    const router = useRouter();
    const [visible, setVisible] = useState(true); // State to control header visibility
    const [lastScrollY, setLastScrollY] = useState(0); // Track the last scroll position

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

    useEffect(() => {
        const handleScroll = () => {
            // Get the current scroll position
            const currentScrollY = window.scrollY;

            // Check if scrolling down or up
            if (currentScrollY > lastScrollY) {
                // Scrolling down
                setVisible(false); // Hide header
            } else {
                // Scrolling up
                setVisible(true); // Show header
            }

            // Update last scroll position
            setLastScrollY(currentScrollY);
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <header className={`header ${visible ? 'visible' : 'hidden'}`}>
            <Head>
                <title>Disaster Relief Fund | Transforming Aid through Decentralized Solutions</title>
                <meta 
                    name="description" 
                    content="Join the Disaster Relief Fund on Arbitrum to empower communities impacted by natural disasters. Propose, vote, and donate transparently." 
                />
            </Head>
            <div className="logo">
                <h1>Disaster Relief Fund</h1>
            </div>
            <div className="connect-btn">
                <ConnectButton />
            </div>
            <nav className="navigation">
                <Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link>
                
                    <>
                        <Link href="/proposals/create" className={isActive('/proposals/create') ? 'active' : ''}>Create Proposal</Link>
                        <Link href="/proposals/pending" className={isActive('/proposals/pending') ? 'active' : ''}>Vote on Proposals</Link>
                        <Link href="/proposals/approved" className={isActive('/proposals/approved') ? 'active' : ''}>Approved Proposals</Link>
                        <Link href="/proposals/rejected" className={isActive('/proposals/rejected') ? 'active' : ''}>Rejected Proposals</Link>
                        {isConnected &&  <Link href="/proposals/userproposals" className={isActive('/proposals/userproposals') ? 'active' : ''}>My Proposals</Link>}
                        {isConnected &&  <Link href="/donations/user-donations" className={isActive('/donations/user-donations') ? 'active' : ''}>My Donations</Link>}
                        {isConnected && <Link href="/proposals/advanced-ops" className={isActive('/proposals/advanced-ops') ? 'active' : ''}>Advanced</Link>}
                     
                        {isConnected &&    <Link href="/governance" className={isActive('/governance') ? 'active' : ''}>Governance</Link>}
                    </>
                 
            </nav>
        </header>
    );
};

export default Header;
