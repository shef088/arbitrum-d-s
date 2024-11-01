After cloning, run the following commands:

pushd frontend
rm -rf .git
corepack enable
yarn install
popd

cd frontend
yarn wagmi generate

 create a new file called .env.development.local in root of frontend directory and add
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=e5b04ba83c50408d72eb248b01e1861e
NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS=0x9db70C8F8Bb780CBAC3a3f99F030d99D5E52569d
NEXT_PUBLIC_ENABLE_TESTNETS=true


yarn dev