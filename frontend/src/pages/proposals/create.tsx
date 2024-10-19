import { useState } from "react";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { deployedAddress, ABI } from "../../contracts/deployed-contract";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";


const CreateProposal = () => {
    const { address } = useAccount();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!address) {
            alert("Please connect your wallet to create a proposal.");
            return;
        }

        setIsSubmitting(true);

        try {
            const txHash = await writeContract({
                address: deployedAddress,
                abi: ABI,
                functionName: "createProposal",
                args: [title, description],
            });

            await waitForTransactionReceipt({ hash: txHash });
            alert("Proposal created successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to create proposal.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="main">
            <ConnectButton />
            <h1>Create Proposal</h1>
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Create Proposal"}
                </button>
            </form>
        </div>
    );
};

export default CreateProposal;
