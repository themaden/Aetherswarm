// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AetherSwarmVault
 * @dev Main vault for decentralized asset management controlled by the AI Swarm.
 */
contract AetherSwarmVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // We define a special "key" for our AI Swarm
    bytes32 public constant SWARM_ROLE = keccak256("SWARM_ROLE");

    // Events help us track what happens in the vault
    event Deposited(address indexed user, address indexed token, uint256 amount);
    event StrategyExecuted(address indexed target, uint256 amount);

    constructor(address admin) {
        // The person who deploys is the admin
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    /**
     * @dev Users can deposit funds to be managed by the swarm.
     */
    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, token, amount);
    }

    /**
     * @dev Only the AI Swarm (Sealed Inference) can execute financial strategies.
     */
    function executeStrategy(address target, uint256 amount, bytes calldata data) 
        external 
        onlyRole(SWARM_ROLE) 
        nonReentrant 
    {
        // This is where the magic happens: the AI swarm moves the money to invest
        (bool success, ) = target.call{value: 0}(data);
        require(success, "Strategy execution failed");
        emit StrategyExecuted(target, amount);
    }

    // Function to receive ETH if needed
    receive() external payable {}
}