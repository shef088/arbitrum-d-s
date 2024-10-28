import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Home = () => {
    const { isConnected } = useAccount();

    return (
        <div className="main">
            <h1>Welcome to the Disaster Relief Fund</h1>
            
            {isConnected ? (
                <div className="nav-links">
                     
                </div>
            ):<ConnectButton />}
        </div>
    );
};

export default Home;
