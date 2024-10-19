import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { deployedAddress, ABI } from "../../contracts/deployed-contract";
import Link from "next/link";
 

const Proposals = () => {
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        const fetchProposals = async () => {
            const proposalCount = await readContract({
                address: deployedAddress,
                abi: ABI,
                functionName: "proposalCount",
            });

            const fetchedProposals = [];
            for (let i = 1; i <= proposalCount; i++) {
                const proposal = await readContract({
                    address: deployedAddress,
                    abi: ABI,
                    functionName: "proposals",
                    args: [i],
                });
                fetchedProposals.push(proposal);
            }

            setProposals(fetchedProposals);
        };

        fetchProposals();
    }, []);

    return (
        <div className="main">
            <h1>Proposals</h1>
            <ul className="proposalList">
                {proposals.map((proposal, index) => (
                    <li key={index}>
                        <Link href={`/proposals/execute?id=${index + 1}`}>
                            <a>{proposal.title}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Proposals;
