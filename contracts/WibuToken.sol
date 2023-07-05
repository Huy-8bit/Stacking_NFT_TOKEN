// SPDX-License-Identifier: MIT

/*
The WibuToken contract creates the WIBU token (built on ERC20) with the following attributes:
- Name: Wibu Token
- Symbol: WIBU
- Total supply: 50 billion tokens
- Decimals: 18
- Additional tokens can be created using the mint function
- Tokens can be transferred using the transfer function
- Tokens can be transferred using the transferFrom function (extended from ERC20)
*/

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WibuToken is ERC20("Wibu Token", "WIBU"), Ownable {
    uint256 private cap = 50_000_000_000 * 10 ** uint256(18); // Token supply cap (50 billion token with 18 decimal places)

    constructor() {
        _mint(msg.sender, cap); // mint all tokens to the contract creator
        transferOwnership(msg.sender); // transfer ownership to the contract creator
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        require(
            ERC20.totalSupply() + _amount <= cap, // check if the total supply after minting is less than or equal to the cap
            "WibuToken: cap exceeded"
        );
        _mint(_to, _amount); // mint tokens to the specified address
    }

    // tranfer amount of tokens from sender to recipient
    function transfer(
        address _to,
        uint256 _amount
    ) public override returns (bool) {
        return super.transfer(_to, _amount);
    }
}
