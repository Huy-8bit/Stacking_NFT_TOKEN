// test file for testing smart contract

const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { id } = require("ethers/lib/utils");

// comandline: npx hardhat test scripts/testStackingPool.js --network sepolia

const stackingNFTPoolPath = "./deployment/StackingNFTPool.json";
const stackingTokenpollPath = "./deployment/StackingTokenPool.json";
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

// Read data from stackingNFTPool JSON file
const stackingNFTPoolJsonData = fs.readFileSync(stackingNFTPoolPath, "utf-8");
const stackingNFTPoolData = JSON.parse(stackingNFTPoolJsonData);
const stackingNFTPoolPathAddress = stackingNFTPoolData.stackingNFTPoolAddress;

// Read data from stackingTokenPool JSON file
const stackingTokenPoolJsonData = fs.readFileSync(
  stackingTokenpollPath,
  "utf-8"
);
const stackingTokenPoolData = JSON.parse(stackingTokenPoolJsonData);
const stackingTokenPoolPathAddress = stackingTokenPoolData.stackingTokenAddress;

// Using values of variables
console.log("tokenAddress:", tokenAddress);
console.log("NFTAddress:", NFTAddress);
console.log("stackingNFTPoolPathAddress:", stackingNFTPoolPathAddress);
console.log("stackingTokenPoolPathAddress:", stackingTokenPoolPathAddress);

describe("StackingNFTPool", function () {
  let stackingNFTPool;
  let wibuNFT;
  let owner;

  beforeEach(async function () {
    const StackingNFTPool = await ethers.getContractFactory("StackingNFTPool");
    stackingNFTPool = await StackingNFTPool.attach(stackingNFTPoolPathAddress);

    const WiBuNFT = await ethers.getContractFactory("WibuNFT");
    wibuNFT = await WiBuNFT.attach(NFTAddress);

    [owner] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the right owner of stackingNFTPool", async function () {
      console.log("sender: ", owner.address);
      console.log("owner: ", await stackingNFTPool.get_owner());
      expect(await stackingNFTPool.get_owner()).to.equal(owner.address);
    });
    // it("Should create new NFT", async function () {
    //   const link_nft =
    //     "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
    //   const newToken = await wibuNFT.createNFT(link_nft);
    //   await new Promise((resolve) => setTimeout(resolve, 12000));
    //   console.log("New NFT: ", newToken);
    // });
    // it("check all my NFT", async function () {
    //   const myNFT = await wibuNFT.getAllMyNft();
    //   console.log("ALl my nft: ");
    //   for (let i = 0; i < myNFT.length; i++) {
    //     if (myNFT[i] != 0) {
    //       console.log("NftID: ", myNFT[i]);
    //     }
    //   }
    // });
    // it("should stake NFT", async function () {
    //   const myNFT = await wibuNFT.getAllMyNft();
    //   // approve NFT
    //   await wibuNFT.approve(stackingNFTPool.address, myNFT[0]);
    //   const result = await stackingNFTPool.stackNFT(myNFT[0]);
    //   await new Promise((resolve) => setTimeout(resolve, 12000));
    //   console.log("stake result: ", result);
    // });

    it("check time to hold", async function () {
      const time1 = await stackingNFTPool.checkTime(1);
      console.log("time to claim: ", time1.toString());
      const time2 = await stackingNFTPool.checkTime(2);
      console.log("time to claim: ", time2.toString());
      const time3 = await stackingNFTPool.checkTime(3);
      console.log("time to claim: ", time3.toString());
      const time4 = await stackingNFTPool.checkTime(4);
      console.log("time to claim: ", time4.toString());
    });
    it("claim reward", async function () {
      const result = await stackingNFTPool.claimReward(3);
      await new Promise((resolve) => setTimeout(resolve, 12000));
      console.log("claim result: ", result);
    });
  });
});
