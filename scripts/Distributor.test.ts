import { ethers } from 'ethers'
import { ethers as hardHatEthers } from 'hardhat'

const DistributorContractAddress = '0xb0936B9940Ac013FfAC2CE4400465A92679e714d'
// const DistributorContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const NumberOfShards = 100

function divideAndPickRandomAddresses(n: number): string[] {
  const segmentSize = ethers.constants.MaxUint256.div(n)
  const randomAddresses: string[] = []

  for (let i = 0; i < n; i++) {
    const start = segmentSize.mul(i)
    const end = start.add(segmentSize).sub(1)
    const randomAddress = getRandomAddressInRange(start, end)
    randomAddresses.push(randomAddress)
  }

  return randomAddresses
}

function getRandomAddressInRange(start: ethers.BigNumber, end: ethers.BigNumber): string {
  const randomBigInt = getRandomBigIntInRange(start, end)
  const randomAddress = ethers.utils.getAddress(randomBigInt.toHexString().substring(0, 42))
  return randomAddress
}

function getRandomBigIntInRange(start: ethers.BigNumber, end: ethers.BigNumber): ethers.BigNumber {
  const range = end.sub(start).add(1)
  const randomOffset = ethers.utils.randomBytes(32)
  const randomBigInt = ethers.BigNumber.from(randomOffset).mod(range).add(start)
  return randomBigInt
}

async function main() {
  // Sender setup
  const [sender] = await hardHatEthers.getSigners()
  console.log(`Initiating transaction to distribute funds from: ${sender.address}`)

  // Recipient picker
  const recipients = divideAndPickRandomAddresses(NumberOfShards)
  console.log(`Distributing evenly to ${recipients.length} recipients b/w (0x00...00 to 0xff...ff):`)

  const senderBalanceBefore = await sender.getBalance()
  console.log('Account balance of sender before tx:', senderBalanceBefore.toString())
  if (senderBalanceBefore.lt(NumberOfShards)) {
    throw new Error('Sender balance is less than the number of recipients')
  }

  const txCount = await sender.getTransactionCount()
  console.log('Transaction count of sender:', txCount.toString())

  // Distributor contract setup
  const distributor = await hardHatEthers.getContractFactory('Distributor')
  const distributorContract = await distributor.attach(DistributorContractAddress)
  console.log('Distributor contract address:', distributorContract.address)

  // Distribute funds
  const tx = await distributorContract.distributeFunds(recipients, {
    value: ethers.utils.parseEther(NumberOfShards.toString()),
    from: sender.address,
    gasLimit: 3000000,
    gasPrice: 1000000000,
    nonce: txCount,
  })
  try {
    console.log('Transaction hash: ', tx.hash)
    const receipt = await tx.wait()
    console.log('Events: ', JSON.stringify(receipt.events, null, 2))
    const senderBalanceAfter = await sender.getBalance()
    console.log('Account balance of sender after tx:', senderBalanceAfter.toString())
    if (senderBalanceAfter.gt(senderBalanceBefore.sub(ethers.utils.parseEther(NumberOfShards.toString())))) {
      console.error('Sender balance is greater than expected')
    } else {
      console.log('Sender balance is as expected')
    }
    await verifyRecipientBalances(recipients, ethers.utils.parseEther('1'))
  } catch (error) {
    console.error(`Error executing tx: ${error}`)
  }
}

async function verifyRecipientBalances(recipients: string[], expectedBalance: ethers.BigNumber) {
  const balancePromises = recipients.map(async (recipient) => {
    const balance = await hardHatEthers.provider.getBalance(recipient)
    return balance
  })

  const results = await Promise.all(balancePromises)

  let successCount = 0
  for (let i = 0; i < recipients.length; i++) {
    if (!results[i].eq(expectedBalance)) {
      console.error(
        `Balance of ${recipients[i]} is not equal to ${expectedBalance}, it is ${results[i].toString()}`
      )
    } else {
      successCount++
    }
  }

  console.log(`${successCount} out of ${recipients.length} recipients have the expected balance`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
