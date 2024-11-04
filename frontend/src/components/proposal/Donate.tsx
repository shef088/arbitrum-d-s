// DonateSection.jsx
import React from 'react';

const Donate = ({ proposal, donationAmountETH, donationAmountUSD, handleEthChange, handleUsdChange, handleDonate }) => {
    return (
        <>
            {proposal.votingPassed && (
                <div className="donate-section">
                    <h3>Donate to this Proposal</h3>
                    <div>
                        <div className=''>
                            <label htmlFor="amounteth">ETH </label>
                            <input
                                name="amounteth"
                                type="number"
                                min="0"
                                value={donationAmountETH}
                                onChange={(e) => handleEthChange(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className=''>
                            <label htmlFor="amountusd">USD </label>
                            <input
                                name="amountusd"
                                type="number"
                                min="0"
                                value={donationAmountUSD}
                                onChange={(e) => handleUsdChange(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <button onClick={handleDonate}>Donate</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Donate;
