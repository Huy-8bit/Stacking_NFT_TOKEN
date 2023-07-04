// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8;

// contract StakingRewards {
//     IERC20 public immutable stakingToken;
//     IERC20 public immutable rewardsToken;

//     address public owner;

//     // Duration of rewards to be paid out (in seconds)
//     uint public duration;
//     // Timestamp of when the rewards finish
//     uint public finishAt;
//     // Minimum of last updated time and reward finish time
//     uint public updatedAt;
//     // Reward to be paid out per second
//     uint public rewardRate;
//     // Sum of (reward rate * dt * 1e18 / total supply)
//     uint public rewardPerTokenStored;
//     // User address => rewardPerTokenStored
//     mapping(address => uint) public userRewardPerTokenPaid;
//     // User address => rewards to be claimed
//     mapping(address => uint) public rewards;

//     // Total staked
//     uint public totalSupply;
//     // User address => staked amount
//     mapping(address => uint) public balanceOf;

//     constructor(address _stakingToken, address _rewardToken) {
//         owner = msg.sender;
//         stakingToken = IERC20(_stakingToken);
//         rewardsToken = IERC20(_rewardToken);
//     }

//     modifier onlyOwner() {
//         require(msg.sender == owner, "not authorized");
//         _;
//     }

//     modifier updateReward(address _account) {
//         rewardPerTokenStored = rewardPerToken();
//         updatedAt = lastTimeRewardApplicable();

//         if (_account != address(0)) {
//             rewards[_account] = earned(_account);
//             userRewardPerTokenPaid[_account] = rewardPerTokenStored;
//         }

//         _;
//     }

//     function lastTimeRewardApplicable() public view returns (uint) {
//         return _min(finishAt, block.number);
//     }

//     function rewardPerToken() public view returns (uint) {
//         if (totalSupply == 0) {
//             return rewardPerTokenStored;
//         }

//         return
//             rewardPerTokenStored +
//             (rewardRate * (lastTimeRewardApplicable() - updatedAt) * 1e18) /
//             totalSupply;
//     }

//     function stake(uint _amount) external updateReward(msg.sender) {
//         require(_amount > 0, "amount = 0");
//         stakingToken.transferFrom(msg.sender, address(this), _amount);
//         balanceOf[msg.sender] += _amount;
//         totalSupply += _amount;
//     }

//     function withdraw(uint _amount) external updateReward(msg.sender) {
//         require(_amount > 0, "amount = 0");
//         balanceOf[msg.sender] -= _amount;
//         totalSupply -= _amount;
//         stakingToken.transfer(msg.sender, _amount);
//     }

//     function earned(address _account) public view returns (uint) {
//         return
//             ((balanceOf[_account] *
//                 (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) +
//             rewards[_account];
//     }

//     function getReward() external updateReward(msg.sender) {
//         uint reward = rewards[msg.sender];
//         if (reward > 0) {
//             rewards[msg.sender] = 0;
//             rewardsToken.transfer(msg.sender, reward);
//         }
//     }

//     function setRewardsDuration(uint _duration) external onlyOwner {
//         require(finishAt < block.number, "reward duration not finished");
//         duration = _duration;
//     }

//     function notifyRewardAmount(
//         uint _amount
//     ) external onlyOwner updateReward(address(0)) {
//         if (block.number >= finishAt) {
//             rewardRate = _amount / duration;
//         } else {
//             uint remainingRewards = (finishAt - block.number) * rewardRate;
//             rewardRate = (_amount + remainingRewards) / duration;
//         }

//         require(rewardRate > 0, "reward rate = 0");
//         require(
//             rewardRate * duration <= rewardsToken.balanceOf(address(this)),
//             "reward amount > balance"
//         );

//         finishAt = block.number + duration;
//         updatedAt = block.number;
//     }

//     function _min(uint x, uint y) private pure returns (uint) {
//         return x <= y ? x : y;
//     }
// }

// interface IERC20 {
//     function totalSupply() external view returns (uint);

//     function balanceOf(address account) external view returns (uint);

//     function transfer(address recipient, uint amount) external returns (bool);

//     function allowance(
//         address owner,
//         address spender
//     ) external view returns (uint);

//     function approve(address spender, uint amount) external returns (bool);

//     function transferFrom(
//         address sender,
//         address recipient,
//         uint amount
//     ) external returns (bool);

//     event Transfer(address indexed from, address indexed to, uint value);
//     event Approval(address indexed owner, address indexed spender, uint value);
// }

pragma solidity ^0.8.0;
import "./WibuNFT.sol";
import "./WibuToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingTokenPool {
    address public owner;
    WibuNFT public wibuNFT;
    WibuToken public wibuToken;

    mapping(address => ListedToken) public stakings;

    struct ListedToken {
        uint256 amount;
        address payable owner;
        uint256 stackingTime;
    }

    event TokenStackedSuccess(
        uint256 indexed amount,
        address owner,
        uint256 stackingTime
    );

    constructor(address _wibuNFTAddress, address _wibuTokenAddress) {
        owner = msg.sender;
        wibuNFT = WibuNFT(_wibuNFTAddress);
        wibuToken = WibuToken(_wibuTokenAddress);
    }

    function mintNFT(string memory _NFT_url) public returns (uint256) {
        return wibuNFT.createNFT(_NFT_url);
    }

    function StackingToken(uint256 _amount) public returns (uint256) {
        require(
            wibuToken.balanceOf(msg.sender) >= _amount,
            "You don't have enough balance to make a transaction"
        );
        wibuToken.transferFrom(msg.sender, address(this), _amount);
        stakings[msg.sender] = ListedToken(
            _amount,
            payable(msg.sender),
            block.number
        );
        emit TokenStackedSuccess(_amount, msg.sender, block.number);
        return block.number;
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    function claimReward() public {
        require(
            block.number >= stakings[msg.sender].stackingTime + 1,
            "Minimum stacking time not reached"
        );

        wibuToken.transfer(msg.sender, 100);
        uint256[] memory listNFT = wibuNFT.getAllMyNft();
        wibuNFT.transferFrom(
            address(this),
            msg.sender,
            listNFT[listNFT.length - 1]
        );
        delete stakings[msg.sender];
    }
}
