# Helper smart contracts

## Contracts

### Resender contract

Solidity smart contract to send back eth, sent to the contract by the caller (gas adjusted)

## Installation and usage

```
npm i
npx hardhat compile
npx hardhat test
npx hardhat run scripts/<deploy script name>.ts
```

```
npx hardhat run scripts/SimpleToken.deploy.ts --network remote
npx hardhat run scripts/SimpleToken.test.ts --network remote
```
