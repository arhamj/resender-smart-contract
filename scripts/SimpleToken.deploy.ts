import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying simple token with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())
  const Token = await ethers.getContractFactory('SimpleToken')
  const t1 = performance.now()
  const tokenContract = await Token.deploy('Test Token', 'TEST', ethers.BigNumber.from('100000000'))
  console.log('Time taken to deploy token:', performance.now() - t1)
  console.log('Token address:', tokenContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
