// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console2} from "forge-std/Test.sol";
import {AetherSwarmVault} from "../src/AetherSwarmVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
// We create a fake token to test with "real" money mechanics
contract MockToken is IERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 public totalSupply;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract AetherSwarmVaultTest is Test {
    AetherSwarmVault public vault;
    MockToken public usdc;

    address public admin = address(0x1);
    address public swarmAgent = address(0x2);
    address public user1 = address(0x3);

    // This runs BEFORE every single test
    function setUp() public {
        // 1. Deploy our fake USDC token
        usdc = new MockToken();

        // 2. Deploy our Vault
        vm.prank(admin); // Pretend to be the admin
        vault = new AetherSwarmVault(admin);

        // 3. Give the Swarm Agent its official role
        vm.prank(admin);
        vault.grantRole(vault.SWARM_ROLE(), swarmAgent);

        // 4. Give User1 some fake money to test
        usdc.mint(user1, 10000 ether); // 10,000 USDC
    }

    /* =========================================================================
       DEPOSIT TESTS
       ========================================================================= */

    function test_DepositSuccessfully() public {
        // User1 approves the vault to take their money
        vm.startPrank(user1);
        usdc.approve(address(vault), 1000 ether);
        
        // User1 deposits money
        vault.deposit(address(usdc), 1000 ether);
        vm.stopPrank();

        // Check if vault received the money
        assertEq(usdc.balanceOf(address(vault)), 1000 ether);
        console2.log("Vault Balance:", usdc.balanceOf(address(vault)));
    }

    // 🚀 FUZZ TESTING: Tests the function with thousands of random numbers!
    function testFuzz_Deposit(uint256 amount) public {
        vm.assume(amount > 0 && amount < 1000000 ether); // Keep it realistic
        
        usdc.mint(user1, amount);
        
        vm.startPrank(user1);
        usdc.approve(address(vault), amount);
        vault.deposit(address(usdc), amount);
        vm.stopPrank();

        assertEq(usdc.balanceOf(address(vault)), amount);
    }

    /* =========================================================================
       SECURITY & EXECUTION TESTS
       ========================================================================= */

    function test_RevertWhen_NormalUserTriesToExecuteStrategy() public {
        vm.prank(user1); // A normal user tries to act like the AI Swarm
        
        // They try to execute a strategy
        bytes32[] memory emptyProof = new bytes32[](0);
        
        vm.expectRevert(); // We EXPECT this to fail (and if it fails, our test passes!)
        vault.executeVerifiedStrategy(address(0), 0, "", emptyProof);
    }

    function test_RevertWhen_InvalidMerkleProof() public {
        vm.prank(swarmAgent); // Even the AI must provide a valid proof
        
        bytes32[] memory fakeProof = new bytes32[](1);
        fakeProof[0] = keccak256("fake");

        vm.expectRevert("Strategy not verified by Swarm");
        vault.executeVerifiedStrategy(address(0), 0, "", fakeProof);
    }
}