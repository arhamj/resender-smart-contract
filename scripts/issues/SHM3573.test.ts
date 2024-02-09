import { ethers } from 'hardhat'

const contractAddress = null

async function deploy() {
  if (contractAddress) {
    console.log('Contract already deployed to:', contractAddress)
    return contractAddress
  }
  const SHM3573 = await ethers.getContractFactory('SHM3573')
  const shm3573 = await SHM3573.deploy()
  await shm3573.deployed()
  return shm3573.address
}

async function main() {
  const contractAddress = await deploy()
  console.log('Contract deployed to:', contractAddress)

  const shm3573 = await ethers.getContractAt('SHM3573', contractAddress)
  const res = await shm3573.getBlockNumber()
  console.log('Pre refresh getBlockNumber:', res.toString())

  await shm3573.refreshBlockNumber()

  const res2 = await shm3573.getBlockNumber()
  console.log('Post refresh getBlockNumber:', res2.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
