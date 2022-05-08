const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // give the a,b value and target the trusted setup file
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        // define the equation and the phase 1 trusted setup
        console.log('1x2 =',publicSignals[0]);
        
        const editedPublicSignals = unstringifyBigInts(publicSignals); // transform the publick signals
        const editedProof = unstringifyBigInts(proof); // transform the proof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals); // get the call data of proof using public signals
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString()); // replace some strings in calldata
    
        const a = [argv[0], argv[1]]; // get a from argv which is from calldata
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]]; // get b from argv which is from calldata
        const c = [argv[6], argv[7]]; // get c from argv which is from calldata
        const Input = argv.slice(8); // get the input from argv which is from calldata

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true; // assert the variables
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0]; // give a value to a
        let b = [[0, 0], [0, 0]]; // give a value to b
        let c = [0, 0]; // give a value to c
        let d = [0] // give a value to d
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false; // assert the variables which should be false
    });
});


describe("Multiplier3 with Groth16", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // give the a,b value and target the trusted setup file
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

        // define the equation and the phase 1 trusted setup
        console.log('1x2x3 =',publicSignals[0]);
        
        const editedPublicSignals = unstringifyBigInts(publicSignals); // transform the publick signals
        const editedProof = unstringifyBigInts(proof); // transform the proof
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals); // get the call data of proof using public signals
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString()); // replace some strings in calldata
    
        const a = [argv[0], argv[1]]; // get a from argv which is from calldata
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]]; // get b from argv which is from calldata
        const c = [argv[6], argv[7]]; // get c from argv which is from calldata
        const Input = argv.slice(8); // get the input from argv which is from calldata

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true; // assert the variables
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0]; // give a value to a
        let b = [[0, 0], [0, 0]]; // give a value to b
        let c = [0, 0]; // give a value to c
        let d = [0] // give a value to d
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false; // assert the variables which should be false
    });
});


describe("Multiplier3 with PLONK", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        // give the a,b value and target the trusted setup file
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3_plonk/multiplier3_plonk.zkey");

        // define the equation and the phase 1 trusted setup
        console.log('1x2x3 =',publicSignals[0]);
        
        const editedPublicSignals = unstringifyBigInts(publicSignals); // transform the publick signals
        const editedProof = unstringifyBigInts(proof); // transform the proof
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals); // get the call data of proof using public signals
    
        const argv = calldata.split(',')

        expect(await verifier.verifyProof(argv[0], JSON.parse(argv[1]))).to.be.true // assert the variables
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
        let b = ['0x0000000000000000000000000000000000000000000000000000000000000000']; 
        expect(await verifier.verifyProof(a, b)).to.be.false; // assert the variables which should be false
    });
});