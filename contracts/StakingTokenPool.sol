pragma solidity ^0.8.0;
import "./WibuNFT.sol";
import "./WibuToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingTokenPool {
    address public owner;
    WibuNFT public wibuNFT;
    WibuToken public wibuToken;
    uint256 public standardBalance;

    mapping(address => ListedToken) public stakings;

    struct ListedToken {
        uint256 amount;
        address payable owner;
        uint256 stackingTime;
        bool flag;
    }

    event TokenStackedSuccess(
        uint256 indexed amount,
        address owner,
        uint256 stackingTime,
        bool flag
    );

    constructor(
        address _wibuNFTAddress,
        address _wibuTokenAddress,
        uint256 _standardBalance
    ) {
        owner = msg.sender;
        wibuNFT = WibuNFT(_wibuNFTAddress);
        wibuToken = WibuToken(_wibuTokenAddress);
        standardBalance = _standardBalance;
    }

    function mintNFT(string memory _NFT_url) public returns (uint256) {
        return wibuNFT.createNFT(_NFT_url);
    }

    function StackingToken(uint256 _amount) public returns (uint256) {
        require(
            wibuToken.balanceOf(msg.sender) >= _amount,
            "You don't have enough balance to make a transaction"
        );
        if (stakings[msg.sender].amount == 0) {
            if (_amount < standardBalance) {
                wibuToken.transferFrom(msg.sender, address(this), _amount);
                stakings[msg.sender] = ListedToken(
                    _amount,
                    payable(msg.sender),
                    block.number,
                    false
                );
            } else {
                wibuToken.transferFrom(msg.sender, address(this), _amount);
                stakings[msg.sender] = ListedToken(
                    _amount,
                    payable(msg.sender),
                    block.number,
                    true
                );
            }
        } else {
            stakings[msg.sender].amount += _amount;
            wibuToken.transferFrom(msg.sender, address(this), _amount);
            if (stakings[msg.sender].amount >= standardBalance) {
                stakings[msg.sender].flag = true;
                stakings[msg.sender].stackingTime = block.number;
            }
        }
        return stakings[msg.sender].amount;
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    function checkTime() public view returns (uint256) {
        return block.number - stakings[msg.sender].stackingTime;
    }

    function claimReward() public {
        require(
            stakings[msg.sender].owner == msg.sender,
            "You are have not staked any token"
        );
        require(
            block.number >= stakings[msg.sender].stackingTime + 24,
            "Minimum stacking time not reached"
        );
        wibuNFT.transferFrom(
            address(this),
            msg.sender,
            wibuNFT.getAllMyNft()[wibuNFT.getAllMyNft().length - 1]
        );
        wibuToken.transfer(msg.sender, stakings[msg.sender].amount);
        delete stakings[msg.sender];
    }

    function claimNFT() public {
        require(
            stakings[msg.sender].owner == msg.sender,
            "You are have not staked any token"
        );
        require(
            stakings[msg.sender].flag == true,
            "You don't have enough balance to claim NFT"
        );
        require(
            block.number >= stakings[msg.sender].stackingTime + 24,
            "Minimum stacking time not reached"
        );
        wibuNFT.transferFrom(
            address(this),
            msg.sender,
            wibuNFT.getAllMyNft()[wibuNFT.getAllMyNft().length - 1]
        );
        stakings[msg.sender].stackingTime = block.number;
    }

    function rewardToken() public {
        require(
            stakings[msg.sender].owner == msg.sender,
            "You are have not staked any token"
        );
        wibuToken.transfer(msg.sender, stakings[msg.sender].amount);
        delete stakings[msg.sender];
    }
}
