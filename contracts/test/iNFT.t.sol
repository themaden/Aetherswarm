// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {AetherSwarmiNFT} from "../src/AetherSwarmiNFT.sol";

/**
 * @title AetherSwarmiNFTTest
 * @dev Unit tests for the Intelligent NFT standard (ERC-7857 simulation).
 */
contract AetherSwarmiNFTTest is Test {
    AetherSwarmiNFT public inft;
    address public admin = address(0x1);
    address public user1 = address(0x2);
    address public hacker = address(0x3);

    function setUp() public {
        vm.prank(admin);
        inft = new AetherSwarmiNFT(admin);
    }

    function test_MintAgentSuccessfully() public {
        vm.prank(admin);
        // Minting an AI agent with a specific brain memory CID
        inft.mintAgent(user1, "ipfs://QmBrainStateHash123");

        assertEq(inft.ownerOf(0), user1);
        assertEq(inft.getModelCID(0), "ipfs://QmBrainStateHash123");
    }

    function test_RevertWhen_HackerTriesToUpdateBrain() public {
        vm.prank(admin);
        inft.mintAgent(user1, "ipfs://QmBrainStateHash123");

        // A hacker tries to change the AI's memory
        vm.prank(hacker);
        vm.expectRevert("Only the owner can update the brain");
        inft.updateModelState(0, "ipfs://QmMaliciousBrainHash");
    }

    function test_OwnerCanUpdateBrain() public {
        vm.prank(admin);
        inft.mintAgent(user1, "ipfs://QmBrainStateHash123");

        // The real owner updates the AI's memory after a successful trading day
        vm.prank(user1);
        inft.updateModelState(0, "ipfs://QmNewBrainState456");

        assertEq(inft.getModelCID(0), "ipfs://QmNewBrainState456");
    }
}