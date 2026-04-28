// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {SwarmHook} from "../src/hooks/SwarmHook.sol";
import {HookMiner} from "../src/lib/HookMiner.sol";

/**
 * @title MineSwarmHook
 * @dev Script to mine the correct CREATE2 salt for the AetherSwarm Uniswap v4 Hook.
 */
contract MineSwarmHook is Script {
    function setUp() public {}

    function run() public view {
        // Dummy addresses for PoolManager and Vault for mining purposes
        address poolManager = 0x0000000000000000000000000000000000000001;
        address vault = 0x0000000000000000000000000000000000000002;
        address deployer = msg.sender;

        // The flags we need: beforeSwap (1 << 7) and afterSwap (1 << 6)
        // This is exactly how Uniswap v4 knows what our contract does without reading the code!
        uint160 flags = uint160(
            (1 << 7) | // BEFORE_SWAP_FLAG
            (1 << 6)   // AFTER_SWAP_FLAG
        );

        console2.log("Target Flags:", flags);
        console2.log("Mining for the perfect Hook address... This might take a second.");

        // Get the creation code of our SwarmHook
        bytes memory creationCode = type(SwarmHook).creationCode;
        bytes memory constructorArgs = abi.encode(poolManager, vault);
        bytes memory initCode = abi.encodePacked(creationCode, constructorArgs);
        
        // Hash the init code for CREATE2
        bytes32 initCodeHash = keccak256(initCode);

        // Mine the salt using our HookMiner library
        bytes32 salt = HookMiner.findSalt(deployer, initCodeHash, flags);

        console2.log("=====================================");
        console2.log("SUCCESS! Magic Salt Found:");
        console2.logBytes32(salt);
        console2.log("=====================================");
        console2.log("Use this salt in your deployment script to deploy the SwarmHook!");
    }
}