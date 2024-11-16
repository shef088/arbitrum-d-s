import React, { useEffect, useState } from 'react';
import fetchUserProposals from '../../utils/fetchUserProposals';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import { ProposalResponse } from '../../types/proposals/types';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import Link from 'next/link';

const UserProposals: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [start, setStart] = useState(0); // Start index for pagination
  const count = 2; // Number of items per page
  const [totalItems, setTotalItems] = useState(0); // Total items for pagination
  const [currentPage, setCurrentPage] = useState(0); // Track current page

  // Fetch proposals based on `start` and `count`
  const fetchProposals = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet to continue");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { proposals: fetchedProposals, totalProposalCount } = await fetchUserProposals(address, start, count);
      setProposals(fetchedProposals);
      setTotalItems(totalProposalCount);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setError("Failed to fetch user proposals.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchProposals on initial load and whenever `start` changes
  useEffect(() => {
    fetchProposals();
  }, [start, isConnected, address]);

  // Handle page change
  const handlePageChange = (selectedPage: number) => {
    setStart(selectedPage * count);
    setCurrentPage(selectedPage); // Update the current page
  };

  
  return (
    <div className="proposals-container">
      <h1>Your Proposals</h1>
        {loading &&  <Loader />}
        {error && <div className="error-message">{error}</div>}
      {proposals.length === 0  && !loading ? (
        <p>No proposals found for this user.</p>
      ) : (
        <ul>
          {proposals.map((proposal) => (
            <div className="inner-proposal" key={proposal.id}>
              <Link href={`/proposals/${proposal.id}`}>
                <h3 className="proposal-title">{proposal.title.substring(0, 100)}</h3>
                <p className="proposal-description">{proposal.description.substring(0, 100)}...</p>
                <div className="proposal-details">
                  <span>Votes For: {Number(proposal.votesFor)}</span>
                  <span>Votes Against: {Number(proposal.votesAgainst)}</span>
                  <span>Voting Deadline: {new Date(Number(proposal.votingDeadline) * 1000).toLocaleString()}</span>
                  <span>
                    Status: {proposal.archived
                      ? "Archived"
                      : proposal.executed
                      ? proposal.votingPassed
                        ? "Approved for Donations"
                        : "Rejected"
                      : "Voting"}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </ul>
      )}
      <Pagination 
        count={count} 
        totalItems={totalItems} 
        onPageChange={handlePageChange} 
        currentPage={currentPage}  // Pass currentPage to Pagination
      />
    </div>
  );
};

export default UserProposals;
