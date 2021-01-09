const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");
const FudiGo = artifacts.require("FudiGo");

module.exports = async function(deployer) {
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed()

  // Deploy EthSwap
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed()

  // Deploy FudiGo
  await deployer.deploy(FudiGo, token.address);
  const fudiGo = await FudiGo.deployed()

  // Transfer all tokens to EthSwap (10 million)
  await token.transfer(ethSwap.address, '10000000000000000000000000')
};
