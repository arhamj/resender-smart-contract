import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Resender smart contract', function () {
  it('Contract should send back eth which was sent to it', async function () {
    const [owner, addr1] = await ethers.getSigners()
    const Resender = await ethers.getContractFactory('Resender')
    const resenderContract = await Resender.deploy(3)
    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address)
    const transaction = await addr1.sendTransaction({
      to: resenderContract.address,
      value: ethers.utils.parseEther('1.0'), // Sends exactly 1.0 ether
    })
    console.debug('send ether transaction hash', transaction.hash)
    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address)
    expect(addr1BalanceAfter.lt(addr1BalanceBefore), 'ensure that gas has been deducted').to.equal(true)
    expect(addr1BalanceBefore.sub(addr1BalanceAfter).lt('100000000000000'), 'ensure that only the gas fee has been reduced').to.equal(true)
    expect(await resenderContract.numberOfResends(addr1.getAddress()), 'ensure that the number of resends is 1').to.equal(1)
  })
  it('Check resend limit', async function () {
    const [owner, addr1] = await ethers.getSigners()
    const Resender = await ethers.getContractFactory('Resender')
    const resenderContract = await Resender.deploy(1)
    const transaction = await addr1.sendTransaction({
      to: resenderContract.address,
      value: ethers.utils.parseEther('1.0'), // Sends exactly 1.0 ether
      gasLimit: 30000000,
      gasPrice: 10000000000,
    })
    console.debug('send ether transaction hash #1', transaction.hash)
    await transaction.wait(1)
    await expect(
      addr1.sendTransaction({
        to: resenderContract.address,
        value: ethers.utils.parseEther('1.0'), // Sends exactly 1.0 ether
        gasLimit: 30000000,
        gasPrice: 10000000000,
      })
    ).to.be.revertedWith('resend limit reached for account')
  })
})
