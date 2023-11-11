import { ethers } from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

const NET_RPC_URL = process.env.NET_RPC_URL
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY

if (!ACCOUNT_PRIVATE_KEY) {
  throw new Error('env ACCOUNT_PRIVATE_KEY is required')
}

if (!NET_RPC_URL) {
  throw new Error('env NET_RPC_URL is required')
}

console.log('NET_RPC_URL:', NET_RPC_URL)
console.log('ACCOUNT_PRIVATE_KEY:', ACCOUNT_PRIVATE_KEY)

const provider = new ethers.providers.WebSocketProvider(NET_RPC_URL)
const privateKey = ACCOUNT_PRIVATE_KEY
const contractAddress = '0xEadcbd9115Eb06698ba6e1Cd7BB4C6381f9E6729'
const recipientAddress = '0x0a0844DA5e01E391d12999ca859Da8a897D5979A' // Replace with the address of the recipient
const amount = ethers.utils.parseUnits('1000', 18) // 18 is the number of decimals for most ERC-20 tokens

provider.on('error', (error) => {
  console.error('WebSocket Provider Error:', error)
})

async function sendTokens() {
  try {
    // Connect to the wallet using the private key
    const wallet = new ethers.Wallet(privateKey, provider)

    console.log('Sending tokens from address:', wallet.address)
    console.log('Account balance:', (await wallet.getBalance()).toString())

    // Load the ERC-20 token contract
    const contractAbi = ['function transfer(address to, uint256 amount)']
    const contract = new ethers.Contract(contractAddress, contractAbi, wallet)

    try {
      // Send tokens to the recipient
      const tx = await contract.transfer(recipientAddress, amount)
      console.log('Transaction hash:', tx.hash)

      // Wait for the transaction to be mined
      await tx.wait()
      console.log('Transaction confirmed.')
    } catch (error) {
      console.error('Error sending tokens:', error)
    }
  } catch (error) {
    console.error('Error sending tokens:', error)
  }
}

sendTokens()
