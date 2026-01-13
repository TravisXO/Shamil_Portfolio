// --- sandbox-tree_v2.js : Decision Architect Scenarios ---

const scenarioDataV2 = {
    start: {
        text: "ALERT: Sudden traffic spike detected on BNOP_MEDIA_V2. Load balancer capacity at 95%. System failure imminent.",
        options: [
            { text: "Scale vertically (Upgrade RAM/CPU instances)", next: "vertical" },
            { text: "Scale horizontally (Launch redundant cluster nodes)", next: "horizontal" }
        ]
    },
    vertical: {
        text: "Upgrade successful, but DB IOPS are now the bottleneck. Costs have tripled. Latency is spiking.",
        options: [
            { text: "Implement Redis Caching Layer", next: "success" },
            { text: "Refactor SQL queries for indexing", next: "success" }
        ]
    },
    horizontal: {
        text: "Clusters deployed. Traffic balanced. However, session state is fragmented—users are being logged out randomly.",
        options: [
            { text: "Enable Sticky Sessions (IP-based)", next: "partial" },
            { text: "Move session data to Distributed Redis Cache", next: "success" }
        ]
    },
    partial: {
        text: "Sessions stabilized for 80% of users, but mobile users on roaming IPs are still dropping. Inefficient.",
        options: [
            { text: "Finalize migration to Distributed Cache", next: "success" }
        ]
    },
    success: {
        text: "ARCHITECTURE OPTIMIZED. System load: 35%. Latency: 42ms. Deployment verified as Production Ready.",
        options: [
            { text: "RESET SIMULATION", next: "start" }
        ]
    }
};

// Expose globally
window.initTreeEngine = function () {
    renderTreeNodeV2('start');
};

window.renderTreeNodeV2 = function (nodeId) {
    const container = document.getElementById('treeView');
    const header = document.getElementById('treeHeader');

    if (!container) return;

    const node = scenarioDataV2[nodeId];
    if (!node) return;

    container.innerHTML = `
        <div class="tree-node border-success shadow-sm">
            <p class="tree-question font-monospace">> ${node.text}</p>
            <div class="tree-options d-grid gap-2">
                ${node.options.map(opt => `
                    <button class="tree-option btn-outline-success" onclick="renderTreeNodeV2('${opt.next}')">
                        [ EXE ] ${opt.text}
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    if (header) header.textContent = `C:/ARCHITECT/SCENARIOS/${nodeId.toUpperCase()}.SYS`;
};