import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

dotenv.config()

const NET_RPC_URL = process.env.NET_RPC_URL
const CHAIN_ID = Number(process.env.CHAIN_ID)
const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY

if (!ACCOUNT_PRIVATE_KEY) {
  throw new Error('env ACCOUNT_PRIVATE_KEY is required')
}

if (!CHAIN_ID) {
  throw new Error('env CHAIN_ID is required and must be a valid number')
}

if (!NET_RPC_URL) {
  throw new Error('env NET_RPC_URL is required')
}

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    remote: {
      url: NET_RPC_URL,
      chainId: CHAIN_ID,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
}

export default config
