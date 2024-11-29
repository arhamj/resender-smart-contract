import { ethers } from 'hardhat'

import { Contract, ContractFactory, constants, utils } from 'ethers'

import factoryArtifact from '@uniswap/v2-core/build/UniswapV2Factory.json'
import pairArtifact from '@uniswap/v2-periphery/build/IUniswapV2Pair.json'
import routerArtifact from '@uniswap/v2-periphery/build/UniswapV2Router02.json'
import WETH9 from '../contracts/amm/WETH9.json'

// const FactoryContractAddress = '0xb0936B9940Ac013FfAC2CE4400465A92679e714d'
// const RouterContractAddress = '0x66c3ca101d1D83bb39CBA20EbF5F4D344Aa7514C'

// const UsdtContractAddress = '0x484F7aBca20b5b52ea8D068dda1E5BB5025f9957'
// const UsdcContractAddress = '0x80e293fC7a3338dC18F06917dbab58Fc921B1bb3'
// const WethContractAddress = '0x113D9a7e00f0EFCfFCB9a4e9f7FdE768977A0BAf'
// const isUsdtMinted = true
// const isUsdcMinted = true
// const isPairCreated = true
// const isTokenApproved = true

const FactoryContractAddress = null
const RouterContractAddress = null

const UsdtContractAddress = null
const UsdcContractAddress = null
const WethContractAddress = null
const isUsdtMinted = false
const isUsdcMinted = false
const isPairCreated = false
const isTokenApproved = false

async function main() {
  const [owner] = await ethers.getSigners()
  console.log('Owner address:', owner.address)

  const t1 = performance.now()
  const Factory = new ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, owner)
  let factory
  if (FactoryContractAddress) {
    factory = await Factory.attach(FactoryContractAddress)
  } else {
    factory = await Factory.deploy(owner.address)
  }
  console.log('Factory deployed to:', factory.address)
  console.log('Time taken to deploy factory:', performance.now() - t1)

  const Usdt = await ethers.getContractFactory('Tether', owner)
  let usdt
  if (UsdtContractAddress) {
    usdt = await Usdt.attach(UsdtContractAddress)
  } else {
    const t2 = performance.now()
    usdt = await Usdt.deploy()
    console.log('Time taken to deploy USDT:', performance.now() - t2)
  }
  console.log('USDT deployed to:', usdt.address)

  if (!isUsdtMinted) {
    const t3 = performance.now()
    await usdt.connect(owner).mint(owner.address, ethers.utils.parseEther('1000000000'))
    console.log('Time taken to mint USDT:', performance.now() - t3)
  }
  console.log('USDT minted to:', owner.address)

  const Usdc = await ethers.getContractFactory('UsdCoin', owner)
  let usdc
  if (UsdcContractAddress) {
    usdc = await Usdc.attach(UsdcContractAddress)
  } else {
    const t4 = performance.now()
    usdc = await Usdc.deploy()
    console.log('Time taken to deploy USDC:', performance.now() - t4)
  }
  console.log('USDC deployed to:', usdc.address)

  if (!isUsdcMinted) {
    const t5 = performance.now()
    await usdc.connect(owner).mint(owner.address, ethers.utils.parseEther('1000000000'))
    console.log('Time taken to mint USDC:', performance.now() - t5)
  }
  console.log('USDC minted to:', owner.address)

  if (!isPairCreated) {
    const t6 = performance.now()
    const tx1 = await factory.createPair(usdt.address, usdc.address, {
      gasPrice: ethers.utils.hexlify(1000000000000),
      gasLimit: ethers.utils.hexlify(10000000),
    })
    await tx1.wait()
    console.log('Time taken to create pair:', performance.now() - t6)
  }

  await sleep(5000)
  const pairAddress = await factory.getPair(usdt.address, usdc.address)
  console.log('Pair created:', pairAddress)

  const pair = new Contract(pairAddress, pairArtifact.abi, owner)
  let reserves = await pair.getReserves()
  console.log('Reserves:', reserves)

  const Weth = new ContractFactory(WETH9.abi, WETH9.bytecode, owner)
  let weth
  if (WethContractAddress) {
    weth = await Weth.attach(WethContractAddress)
  } else {
    const t7 = performance.now()
    weth = await Weth.deploy()
    console.log('Time taken to attach WETH:', performance.now() - t7)
  }
  console.log('WETH deployed to:', weth.address)

  const Router = new ContractFactory(routerArtifact.abi, routerArtifact.bytecode, owner)
  let router
  if (RouterContractAddress) {
    router = await Router.attach(RouterContractAddress)
  } else {
    const t8 = performance.now()
    router = await Router.deploy(factory.address, weth.address)
    console.log('Time taken to deploy router:', performance.now() - t8)
  }
  console.log('Router deployed to:', router.address)

  if (!isTokenApproved) {
    const t9 = performance.now()
    const approveTx1 = await usdt.approve(router.address, constants.MaxUint256)
    await approveTx1.wait()
    console.log('USDT approved to:', router.address)
    console.log('Time taken to approve USDT:', performance.now() - t9)

    const t10 = performance.now()
    const approveTx2 = await usdc.approve(router.address, constants.MaxUint256)
    await approveTx2.wait()
    console.log('USDC approved to:', router.address)
    console.log('Time taken to approve USDC:', performance.now() - t10)
  }

  console.log('Adding liquidity...')
  console.log('Owner balance(USDT):', (await usdt.balanceOf(owner.address)).toString())
  console.log('Owner balance(USDC):', (await usdc.balanceOf(owner.address)).toString())

  const token0Amount = utils.parseEther('100')
  const token1Amount = utils.parseEther('100')

  const deadline = Math.floor(Date.now() / 1000 + 10 * 60)

  const t11 = performance.now()
  const addLiquidityTx = await router
    .connect(owner)
    .addLiquidity(usdt.address, usdc.address, token0Amount, token1Amount, 0, 0, owner.address, deadline, {
      gasLimit: ethers.utils.hexlify(10000000),
    })
  await addLiquidityTx.wait()
  console.log('Time taken to add liquidity:', performance.now() - t11)

  reserves = await pair.getReserves()
  console.log('Reserves:', reserves)

  const t12 = performance.now()
  const swapTx = await router
    .connect(owner)
    .swapExactTokensForTokens(token0Amount, 0, [usdt.address, usdc.address], owner.address, deadline, {
      gasLimit: ethers.utils.hexlify(10000000),
    })
  await swapTx.wait()
  console.log('Time taken to swap:', performance.now() - t12)

  reserves = await pair.getReserves()
  console.log('Reserves after swap:', reserves)
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
