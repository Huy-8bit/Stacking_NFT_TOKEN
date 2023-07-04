// test file for testing smart contract

const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { id } = require("ethers/lib/utils");

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

describe("StakingNFTPool", function () {
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

  describe("Deployment", function () {
    it("Should set the right owner of stakingNFTPool", async function () {
      console.log("sender: ", owner.address);
      console.log("owner: ", await stakingTokenPool.get_owner());
      expect(await stakingTokenPool.get_owner()).to.equal(owner.address);
    });

    it("check time to hold", async function () {
      var time1 = await stakingNFTPool.checkTime(1);
      time1 = (time1 * 15) / 60;
      console.log("time to hold: ", time1.toString());
      var time2 = await stakingNFTPool.checkTime(2);
      time2 = (time2 * 15) / 60;
      console.log("time to hold: ", time2.toString());
      var time3 = await stakingNFTPool.checkTime(3);
      time3 = (time3 * 15) / 60;
      console.log("time to hold: ", time3.toString());
      var time4 = await stakingNFTPool.checkTime(4);
      time4 = (time4 * 15) / 60;
      console.log("time to hold: ", time4.toString());
    });
  });
});
