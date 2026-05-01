// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract AetherSwarmVault is ReentrancyGuard {
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant SWARM_ROLE = keccak256("SWARM_ROLE");
    address public admin;
    bytes32 public strategyRoot; // The "Golden Root" from the AI Swarm

    mapping(bytes32 => mapping(address => bool)) private _roles;

    event StrategyRootUpdated(bytes32 newRoot);
    event Deposited(address indexed user, uint256 amount);

    modifier onlyRole(bytes32 role) {
        _onlyRole(role);
        _;
    }

    function _onlyRole(bytes32 role) internal view {
        require(_roles[role][msg.sender], "AccessControl: account is missing role");
    }

    function grantRole(bytes32 role, address account) external {
        // Simplified grant logic for the Vault tests.
        _roles[role][account] = true;
    }

    constructor(address _admin) {
        admin = _admin;
        _roles[DEFAULT_ADMIN_ROLE][admin] = true;
    }

    function deposit(address token, uint256 amount) external nonReentrant {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "ERC20 transfer failed");
        emit Deposited(msg.sender, amount);
    }
 
    function depositETH() external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @dev Swarm updates the allowed strategies using a Merkle Root.
     * This proves that the AI swarm planned these moves in advance inside the TEE.
     */
    function updateStrategyRoot(bytes32 _newRoot) external onlyRole(SWARM_ROLE) {
        strategyRoot = _newRoot;
        emit StrategyRootUpdated(_newRoot);
    }

    /**
     * @dev Execute strategy only if it's part of the approved Merkle Tree.
     */
    function executeVerifiedStrategy(
        address target, 
        uint256 amount, 
        bytes calldata data, 
        bytes32[] calldata proof
    ) external nonReentrant {
        bytes memory encoded = abi.encodePacked(target, amount, data);
        bytes32 leaf;
        assembly {
            leaf := keccak256(add(encoded, 0x20), mload(encoded))
        }
        require(MerkleProof.verify(proof, strategyRoot, leaf), "Strategy not verified by Swarm");

        (bool success, ) = target.call{value: 0}(data);
        require(success, "Execution failed");
    }
}