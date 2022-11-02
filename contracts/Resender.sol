//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Resender {
    uint64 resendLimitPerAddress;
    mapping(address => uint64) public addressesInteracted;

    constructor(uint64 resendLimit) {
        resendLimitPerAddress = resendLimit;
    }

    fallback() external payable {
        sendBackEth(msg.sender);
    }

    receive() external payable {
        sendBackEth(msg.sender);
    }

    function sendBackEth(address caller) public payable {
        require(caller != address(0), "invalid caller");
        require(addressesInteracted[caller] < resendLimitPerAddress, "resend limit reached for account");
        addressesInteracted[caller] += 1;
        uint256 weiAmountToSendBack = msg.value;
        (bool sent, ) = caller.call{value: weiAmountToSendBack}("");
        require(sent, "Failed to send Ether");
    }

    function numberOfResends(address account) external view returns (uint256) {
        return addressesInteracted[account];
    }
}
