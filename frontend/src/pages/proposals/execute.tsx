import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { readContract, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { deployedAddress, ABI } from "../../contracts/deployed-contract";
import { ConnectButton } from "@rainbow-me/rainbowkit";


const ExecuteProposal = () => {
    const router = useRouter();
    const { id } = router.query;
    const [proposal, setProposal] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        const fetchProposal = async () => {
            if (!id) return;
            const proposalData = await readContract({
                address: deployedAddress,
                abi: ABI,
                functionName: "proposals",
                args: [id],
            });
            setProposal(proposalData);
        };

        fetchProposal();
    }, [id]);

    const handleExecute = async () => {
        if (!id || !proposal) return;
        setIsExecuting(true);

        try {
            const txHash = await writeContract({
                address: deployedAddress,
                abi: ABI,
                functionName: "executeProposal",
                args: [id],
            });

            await waitForTransactionReceipt({ hash: txHash });
            alert("Proposal executed successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to execute proposal.");
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="main">
            <ConnectButton />
            {proposal ? (
                <>
                    <h1>{proposal.title}</h1>
                    <p>{proposal.description}</p>
                    <button onClick={handleExecute} disabled={isExecuting}>
                        {isExecuting ? "Executing..." : "Execute Proposal"}
                    </button>
                </>
            ) : (
                <p>Loading proposal...</p>
            )}
        </div>
    );
};

export default ExecuteProposal;
