import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying simple token with the account:', deployer.address)
  console.log('Account balance:', (await deployer.getBalance()).toString())
  const Resender = await ethers.getContractFactory('SimpleToken')
  const resenderContract = await Resender.deploy('Test Token', 'TEST', ethers.BigNumber.from('100000000'))
  console.log('Token address:', resenderContract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
