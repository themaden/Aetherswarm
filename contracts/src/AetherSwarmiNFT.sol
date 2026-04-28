// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AetherSwarmiNFT
 * @dev Implementation of ERC-7857 like Intelligent NFT.
 * It stores encrypted metadata pointers for the AI Model and TEE state.
 */
contract AetherSwarmiNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Mapping from tokenId to encrypted AI model state (0G Storage CID)
    mapping(uint256 => string) private _modelCid;

    event ModelUpdated(uint256 indexed tokenId, string newCid);

    constructor(address initialOwner) 
        ERC721("AetherSwarm Intelligent NFT", "AiNFT") 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Mints a new Intelligent NFT representing an AI agent.
     * @param to The address that will own the agent.
     * @param modelCid The 0G Storage reference for the AI model's brain.
     */
    function mintAgent(address to, string memory modelCid) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _modelCid[tokenId] = modelCid;
    }

    /**
     * @dev Updates the "brain" (state) of the agent after learning or trading.
     * In a real scenario, only the TEE (Swarm) should call this.
     */
    function updateModelState(uint256 tokenId, string memory newCid) external {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can update the brain");
        _modelCid[tokenId] = newCid;
        emit ModelUpdated(tokenId, newCid);
    }

    /**
     * @dev Returns the CID (address) of the AI model stored on 0G Storage.
     */
    function getModelCid(uint256 tokenId) external view returns (string memory) {
        _requireOwned(tokenId);
        return _modelCid[tokenId];
    }
}