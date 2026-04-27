import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract AetherSwarmVault is AccessControl, ReentrancyGuard {
    bytes32 public strategyRoot; // The "Golden Root" from the AI Swarm

    event StrategyRootUpdated(bytes32 newRoot);

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
        bytes32 leaf = keccak256(abi.encodePacked(target, amount, data));
        require(MerkleProof.verify(proof, strategyRoot, leaf), "Strategy not verified by Swarm");

        (bool success, ) = target.call{value: 0}(data);
        require(success, "Execution failed");
    }
}