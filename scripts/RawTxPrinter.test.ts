import { ethers } from 'hardhat'

async function main() {
  // The sender's wallet
  const [sender] = await ethers.getSigners()

  // Generate random recipient addresses
  const recipients = [...Array(100)].map(() => ethers.Wallet.createRandom().address)

  // Amount to send (in Ether)
  const amountToSend = ethers.utils.parseEther('0.01')

  for (const recipient of recipients) {
    const transaction = {
      to: recipient,
      value: amountToSend,
      nonce: await sender.getTransactionCount(),
      gasLimit: ethers.utils.hexlify(21000),
      gasPrice: await sender.getGasPrice(),
    }

    console.log(`Transaction to send: ${JSON.stringify(transaction, null, 2)}`)

    // Sign the transaction
    const signedTx = await sender.sendTransaction(transaction)
    signedTx.wait()


    // Print the raw transaction string
    console.log(`Raw transaction string: ${signedTx.hash}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
