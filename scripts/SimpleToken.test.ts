import { ethers as hardHatEthers } from 'hardhat'

const SimpleTokenContractAddress = '0x82378e6Fe1b1803f0B2448E7089249f5F7704a33'

const recipientAddress = '0x0a0844da5e01e391d12999ca859da8a897d5979a'

async function tokenTransfer() {
  // Sender setup
  const [sender] = await hardHatEthers.getSigners()
  console.log(`Initiating transaction to transfer token from: ${sender.address}`)

  const txCount = await sender.getTransactionCount()
  console.log('Transaction count of sender:', txCount.toString())

  // Simple token contract setup
  const simpleToken = await hardHatEthers.getContractFactory('SimpleToken')
  const simpleTokenContract = await simpleToken.attach(SimpleTokenContractAddress)
  console.log('Simple token contract address:', simpleTokenContract.address)

  // Transfer tokens
  const tx = await simpleTokenContract.transfer(recipientAddress, '1800')
  console.log('Transaction hash:', tx.hash)

  // Wait for the transaction to be mined
  await tx.wait()
  console.log('Transaction confirmed.')

  // Check balance of recipient
  const recipientBalance = await simpleTokenContract.balanceOf(recipientAddress)
  console.log('Recipient balance:', recipientBalance.toString())

  // Check balance of sender
  const senderBalance = await simpleTokenContract.balanceOf(sender.address)
  console.log('Sender balance:', senderBalance.toString())
}

async function checkTokenBalance(address: string) {
  // Simple token contract setup
  const simpleToken = await hardHatEthers.getContractFactory('SimpleToken')
  const simpleTokenContract = await simpleToken.attach(SimpleTokenContractAddress)
  console.log('Simple token contract address:', simpleTokenContract.address)

  // Check balance of recipient
  const recipientBalance = await simpleTokenContract.balanceOf(address)
  console.log('Recipient balance:', recipientBalance.toString())
}

async function main() {
  await tokenTransfer()
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
