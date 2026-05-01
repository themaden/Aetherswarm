// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MockSwarmHook
 * @dev A presentation-ready mock of the Uniswap v4 SwarmHook.
 * This contract simulates the dynamic fee adjustments controlled by the AI Enclave.
 */
contract MockSwarmHook {
    address public admin;
    uint24 public dynamicFee;
    bool public protectionActive;

    event FeeUpdated(uint24 oldFee, uint24 newFee, string reason);
    event ProtectionToggled(bool isActive);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized: Swarm Enclave only");
        _;
    }

    constructor() {
        admin = msg.sender;
        dynamicFee = 4200; // 0.42%
        protectionActive = true;
    }

    /**
     * @dev Called by the AI backend to adjust swap fees based on LVR risk.
     */
    function setDynamicFee(uint24 _newFee, string calldata _reason) external onlyAdmin {
        uint24 oldFee = dynamicFee;
        dynamicFee = _newFee;
        emit FeeUpdated(oldFee, _newFee, _reason);
    }

    /**
     * @dev Emergency toggle for extreme volatility.
     */
    function toggleProtection() external onlyAdmin {
        protectionActive = !protectionActive;
        emit ProtectionToggled(protectionActive);
    }

    // Standard Uniswap v4 Hook Mock Functions
    function beforeSwap() external view returns (bytes4) {
        require(protectionActive, "SwarmHook: Pool is frozen due to high volatility");
        return this.beforeSwap.selector;
    }
}
