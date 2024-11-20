# Decentralized Disaster Relief Fund

## Overview

The **Decentralized Disaster Relief Fund** is a blockchain-based platform built on Arbitrum that facilitates efficient, transparent, and decentralized management of funds for disaster relief initiatives. The platform empowers communities to propose, vote on, and donate to disaster relief projects while ensuring accountability through on-chain records.

### Key Features
- **Proposal Creation and Voting**: Create and vote on proposals to address disaster relief efforts.  
- **Transparent Donations**: All donations are tracked on-chain, providing full transparency to donors.  
- **Funds Allocation and Governance**: Securely manage the allocation of funds with authorized governance oversight.  
- **Recreation of Proposals**: Archived proposals can be re-evaluated and recreated to revisit prior initiatives.  
- **Search Functionality**: Quickly find proposals by title for streamlined access.  
- **Proposal Archiving**: Organize and archive completed or inactive proposals for better management and focus.  
- **Decentralized Governance**: Stakeholders actively participate in decisions regarding fund allocation and proposal approvals.  
- **Chainlink Automation**: Automate various tasks like voting deadline and execution checks.

## Why Decentralized?

Traditional disaster relief processes often lack efficiency and transparency. By leveraging Arbitrum’s Layer 2 technology, our platform:
- Reduces operational costs by eliminating intermediaries.  
- Ensures immutable records of donations, proposals, and voting outcomes.  
- Empowers communities to take ownership of relief initiatives.  

---

## Live Application

Check out the deployed application:  
👉 **[Decentralized Disaster Relief Fund dApp](<URL to your deployed app>)**

---

## Video Demonstration

📺 Watch a quick demo of the dApp:  
👉 **[Video Demo](<URL to your video demonstration>)**

---

## GitHub Repository

The complete source code for the project is available here:  
👉 **[GitHub Repository](<URL to your GitHub repository>)**

---

## How It Works

1. **Create a Proposal**: Any user can propose a disaster relief initiative by providing a title, description, and voting deadline.  
2. **Vote on Proposals**: Community members vote to approve or reject proposals.  
3. **Allocate Funds**: Upon approval, funds are securely disbursed to the relief efforts as per the proposal.  
4. **Track Donations**: Donors can view how their contributions are utilized for approved projects.  
5. **Recreate Proposals**: Archived proposals can be revised and reintroduced for consideration.  
6. **Search Proposals**: Utilize search functionality to find proposals by title, enhancing user experience and navigation.  
7. **Archive Proposals**: Completed or inactive proposals can be archived for clarity and better proposal management.  
8. **Chainlink Automation**: Use Chainlink’s decentralized oracle network to automate recurring tasks such as proposal voting deadlines and execution checks.
---

## Built With
- **Smart Contracts**: Written in Solidity, deployed on the Arbitrum network.  
- **Frontend**: Built with [your framework/library, e.g., React.js].  
- **Backend**: [Describe if applicable, e.g., Node.js or IPFS].  
- **Arbitrum**: Leveraging Ethereum Layer 2 scalability for fast and low-cost transactions.  
- **Chainlink Automation**: To automate critical operations such as triggering proposal voting deadlines and execution checks.

---

## Submission Track
**Track:** DeFi / RWAs (Real World Assets)  
This dApp provides decentralized financial management of disaster relief funds, making it a perfect fit for the DeFi / RWAs track.  

---

### Installation
### Clone the Repository

```bash
git clone https://github.com/Im-in123/Ecommerce-with-Advanced-Redux-Toolkit-State-Management
cd Ecommerce-with-Advanced-Redux-Toolkit-State-Management
pushd frontend
rm -rf .git
corepack enable
yarn install
popd
```
### Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Git Setup
1. Add .gitignore files to the project:
```bash
git add forum_dapp/.gitignore frontend/.gitignore
git commit -m 'add.gitignore files'
git add -A
git commit -m'ready for deployment'
git push -u origin main
```
Note: Repeat the following commands to commit and push changes to the repository:
```bash
git add -A
git commit -m 'changes'
git push -u origin main
```
### Build, Test and  Deploy Smart Contract
1. Build and test the project
```bash
cd backend
forge build
forge test
```
2. Create a .env file and populate it with the necessary environment variables in the root of the backend folder:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID //Go and create a walletconnect project if you have not.
NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
NEXT_PUBLIC_ENABLE_TESTNETS=true
```
3. Source the .env file:
```bash
source.env
```
4. Deploy the contract to Arbitrum Sepolia:
```bash
forge create --rpc-url "arbitrumSepolia" --private-key "${PRIVATE_KEY}" --verifier-url "https://api-sepolia.arbiscan.io/api" -e "${API_KEY}" --verify src/DisasterReliefFund.sol:DisasterReliefFund
```

### Setup Frontend
1. Install the frontend dependencies and run the following commands in the terminal
```bash
cd frontend
yarn install
yarn wagmi generate
```
2.Create a new file called `.env.development.local` in the root of the frontend directory and add:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID  
NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
NEXT_PUBLIC_ENABLE_TESTNETS=true
```
3.Start the development server:
```bash
yarn wagmi generate
yarn dev
```



### Funding Your Wallet

Sepolia ETH Faucet
To fund your wallet with Sepolia ETH, visit one of the following faucets:

Sepolia Faucet by Google: https://cloud.google.com/application/web3/faucet/ethereum/sepolia
Sepolia Faucet by Chainlink: https://faucets.chain.link/sepolia
Note: Ensure you have at least 0.01 Sepolia ETH before proceeding.

Bridging Sepolia ETH to Arbitrum Sepolia
Visit the Arbitrum Bridge: https://bridge.arbitrum.io/
Connect your wallet and switch to testnet mode.
Bridge 0.005 Sepolia ETH to Arbitrum Sepolia.
Link Testnet Token for Chainlink Keepers Automation
Visit the Chainlink Arbitrum Sepolia Faucet: https://faucets.chain.link/arbitrum-sepolia
Go to https://automation.chain.link/ and set up an automation check.
Connect your wallet and select the testnet.
Create an automation upkeep and enter the smart contract address you want to automate.
Choose the function you want to automate and set the frequency.
Confirm the transactions in your wallet.
That's it! You should now have a fully set up project with a deployed contract on Arbitrum Sepolia and automation set up using Chainlink Keepers.


### My already Deployed Smart Contract Address
Smart Contract Address: 0xF8dC5472716f560c3704f5F95d2C2F077fCA8A3e
 