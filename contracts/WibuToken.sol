pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WibuToken is ERC20("Wibu Token", "WIBU"), Ownable {
    uint256 private cap = 50_000_000_000 * 10 ** uint256(18);

    constructor() public {
        console.log("owner: %s", msg.sender);
        _mint(msg.sender, cap);
        transferOwnership(msg.sender);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        require(
            ERC20.totalSupply() + _amount <= cap,
            "WibuToken: cap exceeded"
        );
        _mint(_to, _amount);
    }

    function transfer(
        address _to,
        uint256 _amount
    ) public override returns (bool) {
        console.log("balanceOf: %s", ERC20.balanceOf(_to));
        console.log("amount: %s", _amount);
        console.log("cap: %s", cap);
        return super.transfer(_to, _amount);
    }
}
