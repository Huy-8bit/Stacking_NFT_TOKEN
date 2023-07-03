const { ethers } = require("hardhat");
const fs = require("fs");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
const utils = ethers.utils;

// comandline: npx hardhat run scripts/deploy.js --network sepolia

const wibuNFTFilePath = "./deployment/WibuNFT.json";
const wibuTokenFilePath = "./deployment/wibuToken.json";
const stackingNFTPoolPath = "./deployment/StackingNFTPool.json";
const stackingTokenpollPath = "./deployment/StackingTokenPool.json";
async function main() {
  var tokenAddress = "";
  var nftAddress = "";
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // deploy WibuToken
  const WibuToken = await ethers.getContractFactory("WibuToken");
  const wibuToken = await WibuToken.deploy();
  await wibuToken.deployed();
  console.log("WibuToken address:", wibuToken.address);
  console.log(
    "Token total supply:",
    (await wibuToken.totalSupply()).toString()
  );
  const wibuTokenData = {
    tokenAddress: wibuToken.address,
  };
  const wibuTokenJsonData = JSON.stringify(wibuTokenData, null, 2);
  fs.writeFileSync(wibuTokenFilePath, wibuTokenJsonData);
  tokenAddress = wibuToken.address;

  // deploy NFT
  const NFT = await ethers.getContractFactory("WibuNFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT address: ", nft.address);
  const nftData = {
    WibuNFTAddress: nft.address,
  };
  const nftJsonData = JSON.stringify(nftData, null, 2);
  fs.writeFileSync(wibuNFTFilePath, nftJsonData);
  nftAddress = nft.address;

  // deploy StackingNFTPoolPath contract
  const StackingNFTPool = await ethers.getContractFactory("StackingNFTPool");
  const stackingNFTPool = await StackingNFTPool.deploy(
    nftAddress,
    tokenAddress
  );
  await stackingNFTPool.deployed();
  console.log("StackingNFTPoolPath address: ", stackingNFTPool.address);
  const stackingData = {
    tokenAddress: tokenAddress,
    NFTAddress: nftAddress,
    stackingNFTPoolAddress: stackingNFTPool.address,
  };
  const stackingJsonData = JSON.stringify(stackingData, null, 2);
  fs.writeFileSync(stackingNFTPoolPath, stackingJsonData);

  // deploy StackingToken contract
  const StackingToken = await ethers.getContractFactory("StackingTokenPool");
  const stackingToken = await StackingToken.deploy(nftAddress, tokenAddress);
  await stackingToken.deployed();
  console.log("StackingToken address: ", stackingToken.address);
  const stackingTokenData = {
    nftAddress: nftAddress,
    tokenAddress: tokenAddress,
    stackingTokenAddress: stackingToken.address,
  };
  const stackingTokenJsonData = JSON.stringify(stackingTokenData, null, 2);
  fs.writeFileSync(stackingTokenpollPath, stackingTokenJsonData);

  console.log("Deployment completed. Data saved to respective JSON files.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
