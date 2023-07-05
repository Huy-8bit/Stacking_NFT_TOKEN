// test file for testing smart contract

const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { id } = require("ethers/lib/utils");
const utils = ethers.utils;
// comandline: npx hardhat test scripts/testStakingTokenPool.js --network sepolia

const stakingNFTPoolPath = "./deployment/StakingNFTPool.json";
const stakingTokenpollPath = "./deployment/StakingTokenPool.json";
const nftFilePath = "./deployment/WibuNFT.json";
const wibuTokenFilePath = "./deployment/wibuToken.json";

// Read data from an NFT . JSON file
const nftJsonData = fs.readFileSync(nftFilePath, "utf-8");
const nftData = JSON.parse(nftJsonData);
const NFTAddress = nftData.WibuNFTAddress;

// Read data from WibuToken's JSON file
const wibuTokenJsonData = fs.readFileSync(wibuTokenFilePath, "utf-8");
const wibuTokenData = JSON.parse(wibuTokenJsonData);
const tokenAddress = wibuTokenData.tokenAddress;

// Read data from stakingTokenPool JSON file
const stakingTokenPoolJsonData = fs.readFileSync(stakingTokenpollPath, "utf-8");
const stakingTokenPoolData = JSON.parse(stakingTokenPoolJsonData);
const stakingTokenPoolPathAddress = stakingTokenPoolData.stakingTokenAddress;

// Using values of variables
console.log("tokenAddress:", tokenAddress);
console.log("NFTAddress:", NFTAddress);
console.log("stakingTokenPoolPathAddress:", stakingTokenPoolPathAddress);

describe("StakingTokenPool", function () {
  let stakingTokenPool;
  let wibuNFT;
  let wibuToken;
  let owner;

  beforeEach(async function () {
    const StakingTokenPool = await ethers.getContractFactory(
      "StakingTokenPool"
    );
    stakingTokenPool = await StakingTokenPool.attach(
      stakingTokenPoolPathAddress
    );
    const WibuToken = await ethers.getContractFactory("WibuToken");
    wibuToken = await WibuToken.attach(tokenAddress);

    [owner] = await ethers.getSigners();
  });
  describe("create NFT for pool", function () {
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await stakingTokenPool.mintNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
    });
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await stakingTokenPool.mintNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
    });
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await stakingTokenPool.mintNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
    });
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await stakingTokenPool.mintNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
    });
  });

  describe("Deployment", function () {
    // it("Should set the right owner of stakingTokenPool", async function () {
    //   console.log("sender: ", owner.address);
    //   console.log("owner: ", await stakingTokenPool.get_owner());
    //   expect(await stakingTokenPool.get_owner()).to.equal(owner.address);
    // });
    // it("should StackingToken", async function () {
    //   const amount = utils.parseEther("1200000");
    //   // approve
    //   await wibuToken.approve(stakingTokenPool.address, amount);
    //   // stake
    //   const result = await stakingTokenPool.StackingToken(amount);
    //   await new Promise((resolve) => setTimeout(resolve, 15000));
    //   console.log("send to stakingtokken: ", amount);
    // });
    // it("check get_standardBalance ", async function () {
    //   const result = await stakingTokenPool.get_standardBalance();
    //   console.log("result: ", result);
    // });
    // it("check time to hold", async function () {
    //   var time = await stakingTokenPool.checkTime();
    //   time = (time * 15) / 60;
    //   console.log("time to hold: ", time);
    // });
    // it("should get claimReward", async function () {
    //   const result = await stakingTokenPool.claimReward();
    //   await new Promise((resolve) => setTimeout(resolve, 15000));
    //   console.log("result: ", result);
    // });
    // it("should get claimNFT", async function () {
    //   const result = await stakingTokenPool.claimNFT();
    //   await new Promise((resolve) => setTimeout(resolve, 15000));
    //   console.log("result: ", result);
    // });
    // it("should get rewardToken", async function () {
    //   const result = await stakingTokenPool.rewardToken();
    //   await new Promise((resolve) => setTimeout(resolve, 15000));
    //   console.log("result: ", result);
    // });
  });
});
