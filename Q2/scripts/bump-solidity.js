const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

let content3 = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
let bumped3 = content3.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped3 = bumped3.replace(verifierRegex, 'contract Multiplier3Verifier');
fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped3);

let content3_plonk = fs.readFileSync("./contracts/Multiplier3Verifier_plonk.sol", { encoding: 'utf-8' });
let bumped3_plonk = content3_plonk.replace(solidityRegex, 'pragma solidity ^0.8.0');
// bumped3_plonk = bumped3_plonk.replace(verifierRegex, 'contract Multiplier3Verifier_plonk');
fs.writeFileSync("./contracts/Multiplier3Verifier_plonk.sol", bumped3_plonk);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment