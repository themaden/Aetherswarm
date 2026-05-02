import * as crypto from 'crypto';

export class AxlNode {
    private node: any;
    private peers: Map<string, any> = new Map();
    public nodeId: string;
    public status: string = 'Initializing...';
    public role: string;

    constructor(role: string = 'Swarm Agent') {
        this.nodeId = crypto.randomBytes(16).toString('hex');
        this.role = role;
    }

    async start(): Promise<void> {
        try {
            console.log(`[AXL] Starting libp2p node (ID: ${this.nodeId})...`);
            
            // Use Function constructor to bypass ts-node transpiling dynamic imports into require()
            const importESM = new Function('modulePath', 'return import(modulePath)');
            
            const { createLibp2p } = await importESM('libp2p');
            const { tcp } = await importESM('@libp2p/tcp');
            const { webSockets } = await importESM('@libp2p/websockets');
            const { noise } = await importESM('@chainsafe/libp2p-noise');
            const { yamux } = await importESM('@chainsafe/libp2p-yamux');
            const { mdns } = await importESM('@libp2p/mdns');
            const { identify } = await importESM('@libp2p/identify');

            this.node = await createLibp2p({
                addresses: {
                    // Listen on random ports for tcp and websockets
                    listen: ['/ip4/0.0.0.0/tcp/0', '/ip4/0.0.0.0/tcp/0/ws']
                },
                transports: [
                    tcp(),
                    webSockets()
                ],
                connectionEncrypters: [
                    noise()
                ],
                streamMuxers: [
                    yamux()
                ],
                peerDiscovery: [
                    mdns({
                        interval: 1000
                    })
                ],
                services: {
                    identify: identify()
                }
            });

            this.node.addEventListener('peer:discovery', (evt: any) => {
                const peerId = evt.detail.id.toString();
                if (!this.peers.has(peerId)) {
                    console.log(`[AXL] Peer Discovered (mDNS): ${peerId.substring(0, 8)}...`);
                }
            });

            this.node.addEventListener('peer:connect', (evt: any) => {
                const peerId = evt.detail.toString();
                this.peers.set(peerId, { connectedAt: Date.now() });
                console.log(`[AXL] Connection established with peer: ${peerId.substring(0, 8)}...`);
            });

            this.node.addEventListener('peer:disconnect', (evt: any) => {
                const peerId = evt.detail.toString();
                this.peers.delete(peerId);
                console.log(`[AXL] Peer disconnected: ${peerId.substring(0, 8)}...`);
            });

            await this.node.start();
            this.status = 'Active';
            
            this.node.getMultiaddrs().forEach((addr: any) => {
                console.log(`[AXL] Node listening on: ${addr.toString()}`);
            });
            
            console.log(`[AXL] libp2p node started successfully with peer ID: ${this.node.peerId.toString()}`);
        } catch (error) {
            console.error('[AXL] Failed to start libp2p node:', error);
            this.status = 'Failed';
        }
    }

    getConnectedPeers() {
        return Array.from(this.peers.entries()).map(([id, data]) => ({
            id,
            ...data
        }));
    }

    getLibp2pId() {
        return this.node ? this.node.peerId.toString() : this.nodeId;
    }
}