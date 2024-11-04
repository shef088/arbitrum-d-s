curl -L https://foundry.paradigm.xyz | bash
foundryup
forge init backend --no-git --no-commit 
cd backend

forge build
forge test

create .env and populate

source .env
forge create --rpc-url "arbitrumSepolia" --private-key "${PRIVATE_KEY}" --verifier-url "https://api-sepolia.arbiscan.io/api" -e "${API_KEY}" --verify src/DisasterReliefFund.sol:DisasterReliefFund





# Once done, run the following commands at the root of your project directory  
git add forum_dapp/.gitignore frontend/.gitignore
git commit -m 'add .gitignore files'
git add -A
git commit -m 'ready for deployment'
git push -u origin main


Testnet Tokens Faucet
Fund Your Wallet Using a Faucet

Now, let’s fund your wallet with Sepolia ETH. You can do this by requesting test tokens (a process known as a "drip") from one of the following faucets:

 Sepolia Faucet by Google    - https://cloud.google.com/application/web3/faucet/ethereum/sepolia
- Sepolia Faucet by Chainlink - https://faucets.chain.link/sepolia

Once your drip request is complete, your MetaMask or prefrred wallet balance should update to reflect the Sepolia ETH you’ve received.

Note: Ensure you have at least 0.01 Sepolia ETH before proceeding to the next step.

Now that your wallet is set up and funded, you’re ready to bridge Sepolia ETH from the Ethereum Sepolia network to Arbitrum Sepolia using the Arbitrum Bridge!
Arbitrum Bridge  - https://bridge.arbitrum.io/

Once you’re on the Arbitrum Bridge, the first step is to connect your wallet. After successfully connecting your wallet, you should see the following screen:


Note: By default, the network is set to mainnet. Since we’re bridging Sepolia ETH from Ethereum Sepolia to Arbitrum Sepolia, we’ll need to switch to testnet mode.
Proceed to bridge 0.005 Sepolia ETH by clicking on “Move funds to Arbitrum Sepolia”
Sign the confirmation transaction in your wallet. Done.

Link testnet token for chainlink keepers automation
Please visit the Chainlink Arbitrum Sepolia Faucet to receive testnet LINK.
https://faucets.chain.link/arbitrum-sepolia

Then go to https://automation.chain.link/ and setup an automation check.
Connect your wallet.
Select the testnet.
Create an automatio upkeep
Then enter the smart contract address  you want the automation done on.
Its going to fetch your smart contract functions so you can choose which functiion you want to automate.
After choosing, you can select the time-based check or any choice and set the frequency.
A couple of confirmations in your wallet will popup, confirm them all and you are done. 