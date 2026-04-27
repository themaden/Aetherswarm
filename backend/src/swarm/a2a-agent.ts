import { AxlNode } from "./axl-node";
import { MCPServer } from "./mcp-server";

/**
 * @class AetherAgent
 * @description The core AI entity that collaborates with other agents in the swarm.
 */
export class AetherAgent {
    private p2p: AxlNode;
    private tools: MCPServer;

    constructor() {
        this.p2p = new AxlNode();
        this.tools = new MCPServer();
    }

    /**
     * @dev Delegate a task to another agent (e.g., Risk Analysis).
     */
    async delegateTask(task: string, targetAgent: string) {
        console.log(`[A2A] Delegating task: "${task}" to agent ${targetAgent}`);
        await this.p2p.sendSecureMessage(targetAgent, {
            protocol: "A2A",
            action: "EXECUTE_TASK",
            task: task,
            timestamp: Date.now()
        });
    }
}