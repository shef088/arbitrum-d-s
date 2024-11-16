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

  // Fetch the total number of proposals on initial load
  const fetchTotalProposalCount = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet to continue");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch the total proposal count (this won't return any proposals, just the total count)
      const totalProposalCount = await fetchUserProposals(address, 0, 0); // Pass (0, 0) to only get the count
      setTotalItems(totalProposalCount.totalProposalCount);
    } catch (err) {
      console.error("Failed to fetch total proposal count:", err);
      setError("Failed to fetch total proposal count.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch proposals based on start and count
  const fetchProposals = async () => {
    if (!isConnected || !address) {
      toast.error("Connect your wallet to continue");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Now, fetch the proposals based on calculated start and count
      const { proposals: fetchedProposals } = await fetchUserProposals(address, start, count);
      setProposals(fetchedProposals.reverse());
      setError(null);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setError("Failed to fetch user proposals.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch total count when the component mounts
  useEffect(() => {
    fetchTotalProposalCount();
  }, [isConnected, address]);

  // Fetch proposals based on start and count whenever start changes
  useEffect(() => {
    if (totalItems > 0) {
      // Calculate the start index for the first page
      let calculatedStart = totalItems - count;
      if (calculatedStart < 0) {
        calculatedStart = 0;
      }
      setStart(calculatedStart);
    }
  }, [totalItems]);

  // Fetch proposals after calculating start
  useEffect(() => {
    if (totalItems > 0 && start !== null) {
      fetchProposals();
    }
  }, [start, totalItems]);

  // Handle page change
  const handlePageChange = (selectedPage: number) => {
    // Calculate new start based on the selected page
    let newStart = totalItems - (selectedPage + 1) * count;

    // Ensure newStart is not negative
    if (newStart < 0) {
      newStart = 0;
    }

    setStart(newStart);
    setCurrentPage(selectedPage); // Update the current page
  };

  return (
    <div className="proposals-container">
      <h1>Your Proposals</h1>
      {loading && <Loader />}
      {error && <div className="error-message">{error}</div>}
      {proposals.length === 0 && !loading && !error? (
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
