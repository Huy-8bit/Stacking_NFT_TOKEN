// test file for testing smart contract

const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { id } = require("ethers/lib/utils");

// comandline: npx hardhat test scripts/testStakingNFTPool.js --network sepolia

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

// Read data from stakingNFTPool JSON file
const stakingNFTPoolJsonData = fs.readFileSync(stakingNFTPoolPath, "utf-8");
const stakingNFTPoolData = JSON.parse(stakingNFTPoolJsonData);
const stakingNFTPoolPathAddress = stakingNFTPoolData.stakingNFTPoolAddress;

// Using values of variables
console.log("tokenAddress:", tokenAddress);
console.log("NFTAddress:", NFTAddress);
console.log("stakingNFTPoolPathAddress:", stakingNFTPoolPathAddress);

describe("StakingNFTPool", function () {
  let stakingNFTPool;
  let wibuNFT;
  let owner;

  beforeEach(async function () {
    const StakingNFTPool = await ethers.getContractFactory("StakingNFTPool");
    stakingNFTPool = await StakingNFTPool.attach(stakingNFTPoolPathAddress);

    const WiBuNFT = await ethers.getContractFactory("WibuNFT");
    wibuNFT = await WiBuNFT.attach(NFTAddress);

    [owner] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the right owner of stakingNFTPool", async function () {
      console.log("sender: ", owner.address);
      console.log("owner: ", await stakingNFTPool.get_owner());
      expect(await stakingNFTPool.get_owner()).to.equal(owner.address);
    });

    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await wibuNFT.createNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      console.log("New NFT: ", newToken);
    });
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await wibuNFT.createNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      console.log("New NFT: ", newToken);
    });
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await wibuNFT.createNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      console.log("New NFT: ", newToken);
    });
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await wibuNFT.createNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      console.log("New NFT: ", newToken);
    });
    it("Should create new NFT", async function () {
      const link_nft =
        "https://wallpapers.com/images/high/sasuke-silhouette-4k-sqbl3rfuo2qpepuh.webp";
      const newToken = await wibuNFT.createNFT(link_nft);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      console.log("New NFT: ", newToken);
    });

    it("check all my NFT", async function () {
      const myNFT = await wibuNFT.getAllMyNft();
      console.log("ALl my nft: ");
      for (let i = 0; i < myNFT.length; i++) {
        if (myNFT[i] != 0) {
          console.log("NftID: ", myNFT[i]);
        }
      }
    });
    it("should stake NFT", async function () {
      const myNFT = await wibuNFT.getAllMyNft();
      // approve NFT
      await wibuNFT.approve(stakingNFTPool.address, myNFT[0]);
      const result = await stakingNFTPool.stackNFT(myNFT[0]);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      console.log("stake result: ", result);
    });

    it("check time to hold", async function () {
      var time1 = await stakingNFTPool.checkTime(1);
      time1 = (time1 * 15) / 60;
      console.log("time to hold NFT 1: ", time1.toString());
      var time2 = await stakingNFTPool.checkTime(2);
      time2 = (time2 * 15) / 60;
      console.log("time to hold NFT 2: ", time2.toString());
      var time3 = await stakingNFTPool.checkTime(3);
      time3 = (time3 * 15) / 60;
      console.log("time to hold NFT 3: ", time3.toString());
      var time4 = await stakingNFTPool.checkTime(4);
      time4 = (time4 * 15) / 60;
      console.log("time to hold NFT 4: ", time4.toString());
      var time5 = await stakingNFTPool.checkTime(5);
      time5 = (time5 * 15) / 60;
      console.log("time to hold NFT 5: ", time5.toString());
      var time6 = await stakingNFTPool.checkTime(6);
      time6 = (time6 * 15) / 60;
      console.log("time to hold NFT 6: ", time6.toString());
      var time7 = await stakingNFTPool.checkTime(7);
      time7 = (time7 * 15) / 60;
      console.log("time to hold NFT 7: ", time7.toString());
    });

    it("claim reward", async function () {
      const result = await stakingNFTPool.claimReward(2);
      console.log("claim result: ", result);
    });

    it("claim token", async function () {
      const result = await stakingNFTPool.claimToken(6);
      console.log("claim result: ", result);
    });
  });
});
