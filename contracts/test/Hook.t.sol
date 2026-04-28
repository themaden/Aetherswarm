// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import {Test, console2} from "forge-std/Test.sol";
import {SwarmHook} from "../src/hooks/SwarmHook.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";

/**
 * @title SwarmHookTest
 * @dev Unit tests to verify the dynamic fee adjustment logic by the AI Swarm.
 */

contract SwarmHookTest is Test {
    SwarmHook public hook;
    address public mockPoolManager = address(0x10);
    address public swarmVault = address(0x20);
    address public hacker = address(0x30);

    function setUp() public {
        // We deploy the hook, telling it that swarmVault is the boss
        hook = new SwarmHook(IPoolManager(mockPoolManager), swarmVault);
    }

    function test_InitialFeeIsBaseFee() public {
        assertEq(hook.dynamicFee(), 3000); // 3000 = 0.3%
    }

    function test_SwarmVaultCanUpdateFee() public {
        // The AI Swarm detects high volatility and increases fees to 1% (10000)
        vm.prank(swarmVault);
        hook.updateDynamicFee(10000);

        assertEq(hook.dynamicFee(), 10000);
        console2.log("Dynamic Fee updated to:", hook.dynamicFee());
    }

    function test_RevertWhen_HackerTriesToChangeFee() public {
        // A hacker tries to lower the fee to steal money via arbitrage
        vm.prank(hacker);
        vm.expectRevert(SwarmHook.Unauthorized.selector);
        hook.updateDynamicFee(0);
    }
}