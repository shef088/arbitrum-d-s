import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";


const Home = () => {
    const { isConnected } = useAccount();

    return (
        <div className="main">
            <h1>Welcome to the Disaster Relief Fund</h1>
            <ConnectButton />
            {isConnected && (
                <>
                    <Link href="/proposals/create">
                        <span>Create a Proposal</span>
                    </Link>
                    <Link href="/proposals">
                        <span>View Proposals</span>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Home;
