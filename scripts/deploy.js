const { ethers } = require("hardhat");
const fs = require("fs");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
const utils = ethers.utils;

// comandline: npx hardhat run scripts/deploy.js --network sepolia

const wibuNFTFilePath = "./deployment/WibuNFT.json";
const wibuTokenFilePath = "./deployment/wibuToken.json";
const stakingNFTPoolPath = "./deployment/StakingNFTPool.json";
const stakingTokenpollPath = "./deployment/StakingTokenPool.json";
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

  // deploy StakingNFTPoolPath contract
  var stakingTime = (4 * 1) / 2;
  const StakingNFTPool = await ethers.getContractFactory("StakingNFTPool");
  const stakingNFTPool = await StakingNFTPool.deploy(
    nftAddress,
    tokenAddress,
    stakingTime
  );
  await stakingNFTPool.deployed();
  console.log("StakingNFTPoolPath address: ", stakingNFTPool.address);
  const stakingData = {
    tokenAddress: tokenAddress,
    NFTAddress: nftAddress,
    stakingNFTPoolAddress: stakingNFTPool.address,
    stakingTime: stakingTime,
  };
  const stakingJsonData = JSON.stringify(stakingData, null, 2);
  fs.writeFileSync(stakingNFTPoolPath, stakingJsonData);

  // deploy StakingToken contract
  const standardBalance = utils.parseEther("200000");
  const StakingToken = await ethers.getContractFactory("StakingTokenPool");
  const stakingToken = await StakingToken.deploy(
    nftAddress,
    tokenAddress,
    standardBalance,
    stakingTime
  );
  await stakingToken.deployed();
  console.log("StakingToken address: ", stakingToken.address);
  const stakingTokenData = {
    nftAddress: nftAddress,
    tokenAddress: tokenAddress,
    stakingTokenAddress: stakingToken.address,
    standardBalance: standardBalance,
    stakingTime: stakingTime,
  };
  const stakingTokenJsonData = JSON.stringify(stakingTokenData, null, 2);
  fs.writeFileSync(stakingTokenpollPath, stakingTokenJsonData);

  console.log("Deployment completed. Data saved to respective JSON files.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
