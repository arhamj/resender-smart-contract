// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

contract SHM3573 {
    uint256 public blockNumber = block.number;

    function refreshBlockNumber() external {
        blockNumber = block.number;
    }

    function getBlockNumber() external view returns (uint256 _blockNumber) {
        _blockNumber = block.number;
    }
}
