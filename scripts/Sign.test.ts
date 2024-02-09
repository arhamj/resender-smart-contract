import { ethers } from 'hardhat'

async function main() {
  const [signer] = await ethers.getSigners()
  console.log('Account:', signer.address)

  // Initialize an Ethereum wallet with a private key

  // Define your arbitrary message
  const message = 'Hello, Ethereum!'

  // Sign the message
  const messageBytes = ethers.utils.toUtf8Bytes(message)
  const messageHash = ethers.utils.keccak256(messageBytes)
  const signature = await signer.signMessage(messageHash)

  // Parse the signature
  const { v, r, s } = ethers.utils.splitSignature(signature)

  // Encode the message RLP
  const messageRLP = ethers.utils.defaultAbiCoder.encode(['bytes32'], [messageHash])

  // Print the results
  console.log('Message:', message)
  console.log('Message Hash:', messageHash)
  console.log('v:', v)
  console.log('r:', r)
  console.log('s:', s)
  console.log('Message RLP (Hex):', messageRLP)
  console.log('Chain ID:', await signer.getChainId())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
