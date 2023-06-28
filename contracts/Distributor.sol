// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Distributor {
    function distributeFunds(address payable[] memory recipients) external payable {
        uint256 amount = msg.value / recipients.length;

        uint256 successfulTransferCount;

        for (uint256 i = 0; i < recipients.length; i++) {
            // transfers can fail, handle this case in the most simple way by skipping the recipient
            (bool iSuccess, ) = recipients[i].call{value: amount}("");
            if (iSuccess) {
                successfulTransferCount++;
            } else {
                continue;
            }
        }

        // If there is any remaining balance, send it back to the sender
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer of remaining balance failed.");

        emit TransferCount(successfulTransferCount);
    }

    event TransferCount(uint256 count);
}
