# Stacking_NFT_TOKEN


## Description
work flow uml: 
![Alt text](work_flow.drawio.png)

## Command line

```bash
npm install --save-dev

npx hardhat compile

npx hardhat run scripts/deploy.js --network sepolia

npx hardhat test scripts/testTransactionToken.js --network sepolia

npx hardhat test scripts/testStakingTokenPool.js --network sepolia

npx hardhat test scripts/testStakingNFTPool.js --network sepolia

