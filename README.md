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

## Setup Frontend
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


## My already Deployed Smart Contract Address
Smart Contract Address: 0xF8dC5472716f560c3704f5F95d2C2F077fCA8A3e
 