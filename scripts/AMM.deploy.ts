import { ethers } from 'hardhat'

import { Contract, ContractFactory, constants, utils } from 'ethers'

import factoryArtifact from '@uniswap/v2-core/build/UniswapV2Factory.json'
import pairArtifact from '@uniswap/v2-periphery/build/IUniswapV2Pair.json'
import routerArtifact from '@uniswap/v2-periphery/build/UniswapV2Router02.json'
import WETH9 from '../contracts/amm/WETH9.json'

const FactoryContractAddress = null
const UsdtContractAddress = null
const UsdcContractAddress = null
const isUsdtMinted = false
const isUsdcMinted = false

async function main() {
  const [owner] = await ethers.getSigners()

  const Factory = new ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, owner)
  let factory
  if (FactoryContractAddress) {
    factory = await Factory.attach(FactoryContractAddress)
  } else {
    factory = await Factory.deploy(owner.address)
  }
  console.log('Factory deployed to:', factory.address)

  const Usdt = await ethers.getContractFactory('Tether', owner)
  let usdt
  if (UsdtContractAddress) {
    usdt = await Usdt.attach(UsdtContractAddress)
  } else {
    usdt = await Usdt.deploy()
  }
  console.log('USDT deployed to:', usdt.address)

  if (!isUsdtMinted) {
    await usdt.connect(owner).mint(owner.address, ethers.utils.parseEther('1000000000'))
  }
  console.log('USDT minted to:', owner.address)

  const Usdc = await ethers.getContractFactory('UsdCoin', owner)
  let usdc
  if (UsdcContractAddress) {
    usdc = await Usdc.attach(UsdcContractAddress)
  } else {
    usdc = await Usdc.deploy()
  }
  console.log('USDC deployed to:', usdc.address)

  if (!isUsdcMinted) {
    await usdc.connect(owner).mint(owner.address, ethers.utils.parseEther('1000000000'))
  }
  console.log('USDC minted to:', owner.address)

  const tx1 = await factory.createPair(usdt.address, usdc.address, {
    gasPrice: ethers.utils.hexlify(1000000000000),
    gasLimit: ethers.utils.hexlify(10000000),
  })
  await tx1.wait()

  const pairAddress = await factory.getPair(usdt.address, usdc.address)
  console.log('Pair created:', pairAddress)

  const pair = new Contract(pairAddress, pairArtifact.abi, owner)
  let reserves = await pair.getReserves()
  console.log('Reserves:', reserves)

  const Weth = new ContractFactory(WETH9.abi, WETH9.bytecode, owner)
  const weth = await Weth.deploy()
  console.log('WETH deployed to:', weth.address)

  const Router = new ContractFactory(routerArtifact.abi, routerArtifact.bytecode, owner)
  const router = await Router.deploy(factory.address, weth.address)
  console.log('Router deployed to:', router.address)

  const approveTx1 = await usdt.approve(router.address, constants.MaxUint256)
  await approveTx1.wait()
  console.log('USDT approved to:', router.address)

  const approveTx2 = await usdc.approve(router.address, constants.MaxUint256)
  await approveTx2.wait()
  console.log('USDC approved to:', router.address)

  console.log('Adding liquidity...')
  console.log('Owner balance(USDT):', (await usdt.balanceOf(owner.address)).toString())
  console.log('Owner balance(USDC):', (await usdc.balanceOf(owner.address)).toString())

  const token0Amount = utils.parseEther('100')
  const token1Amount = utils.parseEther('100')

  const deadline = Math.floor(Date.now() / 1000 + 10 * 60)

  const addLiquidityTx = await router
    .connect(owner)
    .addLiquidity(usdt.address, usdc.address, token0Amount, token1Amount, 0, 0, owner.address, deadline, {
      gasLimit: ethers.utils.hexlify(10000000),
    })
  await addLiquidityTx.wait()

  reserves = await pair.getReserves()
  console.log('Reserves:', reserves)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
