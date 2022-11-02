import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

dotenv.config()

const NET_RPC_URL = process.env.NET_RPC_URL

const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY
if (!ACCOUNT_PRIVATE_KEY) {
  console.log('env ACCOUNT_PRIVATE_KEY required')
  process.exit(0)
}

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    remote: {
      url: NET_RPC_URL,
      accounts: [ACCOUNT_PRIVATE_KEY],
    },
  },
}

export default config
