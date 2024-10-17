curl -L https://foundry.paradigm.xyz | bash
foundryup
forge init backend --no-git --no-commit 
cd backend


source .env
forge create --rpc-url "arbitrumSepolia" --private-key "${PRIVATE_KEY}" --verifier-url "https://api-sepolia.arbiscan.io/api" -e "${API_KEY}" --verify src/DisasterReliefFund.sol:DisasterReliefFund





# Once done, run the following commands at the root of your project directory  
git add forum_dapp/.gitignore frontend/.gitignore
git commit -m 'add .gitignore files'
git add -A
git commit -m 'ready for deployment'