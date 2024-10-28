// components/Header.tsx
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Header: React.FC = () => {
    const { isConnected } = useAccount();

    return (
        <header className="header">
            <h1>Disaster Relief Fund</h1>
            <nav>
                <Link href="/">Home</Link>
                {isConnected && (
                    <>
                        <Link href="/proposals/create">Create Proposal</Link>
                        <Link href="/proposals">View Proposals</Link>
                        <Link href="/proposals/pending">Vote on Proposals</Link>
                        <Link href="/proposals/approved">Approved Proposals</Link>
                        <Link href="/proposals/rejected">Rejected Proposals</Link>
                    </>
                )}
            </nav>
            <div className="connect-btn">
                <ConnectButton />
            </div>
        </header>
    );
};

export default Header;
