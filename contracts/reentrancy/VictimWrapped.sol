// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract VictimWrapped {
    mapping(address => uint) public balances;
    bool private locked;

    modifier noReentrant() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) public noReentrant {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Log balance before withdrawal
        console.log("Balance before withdrawal:", address(this).balance);

        balances[msg.sender] -= _amount;

        (bool sent, ) = msg.sender.call{value: _amount}("");
        console.log("withdraw: %s caller: %s", _amount, msg.sender);
        require(sent, "Failed to send Ether");

        // Log balance after withdrawal
        console.log("Balance after withdrawal:", address(this).balance);
    }

    receive() external payable {}
}
