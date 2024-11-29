import { ethers as hardHatEthers } from 'hardhat'

const SimpleTokenContractAddress = '0xEadcbd9115Eb06698ba6e1Cd7BB4C6381f9E6729'
const transferAmount = '100'
const tps = 3

// Generates a random wallet address
function generateRandomAddress() {
  return hardHatEthers.Wallet.createRandom().address
}

async function tokenTransfer(transferCount: number) {
  const [sender] = await hardHatEthers.getSigners()
  console.log(`Initiating transactions to transfer token from: ${sender.address}`)

  const simpleToken = await hardHatEthers.getContractFactory('SimpleToken')
  const simpleTokenContract = await simpleToken.attach(SimpleTokenContractAddress)

  let passCount = 0
  let failCount = 0

  let txPromises = []

  for (let i = 0; i < transferCount; i++) {
    const recipientAddress = generateRandomAddress() // Generate a new random address for each transfer
    console.log(`Transfer attempt ${i + 1}: Sending ${transferAmount} tokens to ${recipientAddress}`)

    txPromises.push(simpleTokenContract.transfer(recipientAddress, transferAmount))
    sleep(1000 / tps)
  }

  const txs = await Promise.allSettled(txPromises)

  for (let i = 0; i < txs.length; i++) {
    const tx = txs[i]
    if (tx.status === 'fulfilled') {
      passCount++
    } else {
      failCount++
      console.error(`Transfer attempt ${i + 1} failed: ${tx.reason}`)
    }
  }

  console.log(`Transfer Summary: ${passCount} Passed, ${failCount} Failed to random addresses`)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const transferCount = 10
  await tokenTransfer(transferCount)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
