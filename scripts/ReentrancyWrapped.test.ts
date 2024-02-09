import { ethers } from 'hardhat'

async function main() {
  console.log('Deploying Victim contract...')
  const Victim = await ethers.getContractFactory('VictimWrapped')
  const victim = await Victim.deploy()
  await victim.deployed()
  console.log('Victim contract deployed at:', victim.address)

  console.log('Deploying Attacker contract...')
  const Attacker = await ethers.getContractFactory('Attacker')
  const attacker = await Attacker.deploy(victim.address, ethers.utils.parseEther('1'))
  await attacker.deployed()
  console.log('Attacker contract deployed at:', attacker.address)

  console.log('Sending Ether to Victim contract for initial balance...')
  await victim.deposit({ value: ethers.utils.parseEther('10') })

  console.log('Simulating attack...')
  const tx = await attacker.attack({
    value: ethers.utils.parseEther('1'),
    gasLimit: ethers.utils.hexlify(1000000),
  })
  const txReceipt = await tx.wait()
  console.log('Attack tx hash:', tx.hash, txReceipt.status)

  console.log('Finalizing attack...')
  await attacker.finalizeAttack()

  console.log('Checking balances...')
  const victimBalance = await ethers.provider.getBalance(victim.address)
  const attackerBalance = await ethers.provider.getBalance(attacker.address)
  console.log('Victim Balance: ', ethers.utils.formatEther(victimBalance))
  console.log('Attacker Balance: ', ethers.utils.formatEther(attackerBalance))

  // Checks
  if (victimBalance.toString() === ethers.utils.parseEther('2').toString()) {
    console.log("Test passed: Victim's balance is as expected.")
  } else {
    console.log("Test failed: Victim's balance is not as expected.")
  }

  if (attackerBalance.toString() === ethers.utils.parseEther('1').toString()) {
    console.log("Test passed: Attacker's balance is as expected.")
  } else {
    console.log("Test failed: Attacker's balance is not as expected.")
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
