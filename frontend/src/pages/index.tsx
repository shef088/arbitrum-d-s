import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
yyyy

const Home = () => {
    const { isConnected } = useAccount();

    return (
        <div className="main">
            <h1>Welcome to the Disaster Relief Fund</h1>
            <ConnectButton />
            {isConnected && (
                <>
                    <Link href="/proposals/create">
                        <a>Create a Proposal</a>
                    </Link>
                    <Link href="/proposals">
                        <a>View Proposals</a>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Home;
