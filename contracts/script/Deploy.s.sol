// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {AetherSwarmVault} from "../src/AetherSwarmVault.sol";
import {AetherSwarmiNFT} from "../src/AetherSwarmiNFT.sol";

/**
 * @title DeployAetherSwarm
 * @dev Foundry script to deploy to AetherSwarm ecosystem on-chain.
 */

contract DeployAetherSwarm is Script {
    
    function setUp() public {}

   function run() public {
        // Retrieve private key from environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        // Start broadcasting transactions to the blockchain
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy the Main Vault
        AetherSwarmVault vault = new AetherSwarmVault(deployerAddress);
        console2.log("AetherSwarmVault deployed at:", address(vault));

        // 2. Deploy the Intelligent NFT (iNFT)
        AetherSwarmiNFT inft = new AetherSwarmiNFT(deployerAddress);
        console2.log("AetherSwarmiNFT deployed at:", address(inft));

        // Note: SwarmHook requires a pre-computed address for Uniswap v4.
        // We will handle hook deployment in a separate specialized script.

        vm.stopBroadcast();
    }
}    