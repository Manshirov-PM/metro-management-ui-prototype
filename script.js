document.addEventListener('DOMContentLoaded', () => {

    // (Impersonation removed)

    // --- Notifications Dropdown ---
    const btnNotif = document.getElementById('btn-notifications');
    const notifDropdown = document.getElementById('notifications-dropdown');

    btnNotif.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('active');
    });

    // Close popups when clicking outside
    document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== btnNotif) {
            notifDropdown.classList.remove('active');
        }
    });

    // Prevent dropdown closing when clicking inside it
    notifDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Notifications Tabs (Small tabs)
    const notifTabs = document.querySelectorAll('.tab-sm');
    const notifPanes = document.querySelectorAll('.tab-content-sm');

    notifTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs & panes
            notifTabs.forEach(t => t.classList.remove('active'));
            notifPanes.forEach(p => p.classList.remove('active'));

            // Activate clicked
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // Expand/Collapse long requests
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const p = this.previousElementSibling;
            p.classList.toggle('expanded');
            const icon = this.querySelector('ion-icon');
            if (p.classList.contains('expanded')) {
                icon.setAttribute('name', 'chevron-up-outline');
            } else {
                icon.setAttribute('name', 'chevron-down-outline');
            }
        });
    });

    // Dismiss notifications (Approve/Reject/Delete)
    const notifActionBtns = document.querySelectorAll('.notif-item .action-btn');
    notifActionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.notif-item');
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            setTimeout(() => {
                item.remove();
                updateNotifBadges();
            }, 300);
        });
    });

    function updateNotifBadges() {
        const reqCount = document.querySelectorAll('#tab-notif-requests .notif-item').length;
        const statCount = document.querySelectorAll('#tab-notif-status .notif-item').length;
        const total = reqCount + statCount;

        const mainBadge = document.querySelector('.has-badge .badge');
        if (total > 0) {
            mainBadge.textContent = total;
        } else {
            mainBadge.style.display = 'none';
        }

        // Update small badges (if logic requires, simple implementation here)
        const reqBadgeSm = document.querySelector('.tab-sm[data-target="tab-notif-requests"] .badge-sm');
        if (reqBadgeSm) reqBadgeSm.textContent = reqCount;

        const statBadgeSm = document.querySelector('.tab-sm[data-target="tab-notif-status"] .badge-sm');
        if (statBadgeSm) statBadgeSm.textContent = statCount;
    }

    // --- Main Tabs (Admin vs Business) ---
    const mainTabs = document.querySelectorAll('.main-tab');
    const mainPanes = document.querySelectorAll('.tab-pane');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mainTabs.forEach(t => t.classList.remove('active'));
            mainPanes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    // --- Permissions Table "ALL" functionality ---
    const allSetBtns = document.querySelectorAll('.all-row button');
    allSetBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetVal = this.dataset.col; // owner, viewer, etc.

            // Find all radio groups in the table body
            const tbody = document.querySelector('#permissions-table tbody');
            const rows = tbody.querySelectorAll('tr');

            rows.forEach(row => {
                // Find radio in this row with the matching value
                const radioToSelect = row.querySelector(`input[type="radio"][value="${targetVal}"]`);
                if (radioToSelect) {
                    radioToSelect.checked = true;
                }
            });

            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'DONE';
            this.classList.add('btn-primary');
            this.classList.remove('btn-outline');
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline');
            }, 1000);
        });
    });

});

// --- Modal Global Logic ---
function openModal(modalId) {
    document.getElementById('modal-overlay').classList.add('active');
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById(modalId).classList.remove('active');
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Pipeline Switcher & Info Editor Logic
const pipeSwitcher = document.getElementById('pipeline-switcher');
const topoNodes = document.querySelectorAll('.topo-node');

// Editable Pipeline Info
const btnEditInfo = document.getElementById('btn-edit-pipeline-info');
const displayMode = document.getElementById('pipeline-info-display');
const editMode = document.getElementById('pipeline-info-edit');
const btnSaveInfo = document.getElementById('btn-save-pipeline-info');
const btnCancelInfo = document.getElementById('btn-cancel-pipeline-info');

const titleText = document.getElementById('pipeline-title-text');
const descText = document.getElementById('pipeline-desc-text');
const editName = document.getElementById('edit-pipeline-name');
const editDesc = document.getElementById('edit-pipeline-desc');

if (btnEditInfo) {
    btnEditInfo.addEventListener('click', () => {
        // Populate inputs with current text
        // For the name, we use the switcher's selected text if available, or just fallback to input default
        if (pipeSwitcher && pipeSwitcher.options.length > 0) {
            editName.value = pipeSwitcher.options[pipeSwitcher.selectedIndex].text;
        }
        editDesc.value = descText.innerText;
        displayMode.style.display = 'none';
        editMode.style.display = 'flex';
    });

    btnCancelInfo.addEventListener('click', () => {
        editMode.style.display = 'none';
        displayMode.style.display = 'flex';
    });

    btnSaveInfo.addEventListener('click', () => {
        // Save changes to display elements
        if (pipeSwitcher && pipeSwitcher.options.length > 0) {
            pipeSwitcher.options[pipeSwitcher.selectedIndex].text = editName.value;
        }
        descText.innerText = editDesc.value;
        editMode.style.display = 'none';
        displayMode.style.display = 'flex';
    });
}

if (pipeSwitcher) {
    pipeSwitcher.addEventListener('change', (e) => {
        const selectedPipeText = e.target.options[e.target.selectedIndex].text;

        if (descText) descText.innerText = `Detailed description mapping for ${selectedPipeText} execution layer.`;

        // Update Group Owners Header and filter cards
        const goHeader = document.getElementById('group-owner-header');
        if (goHeader) {
            goHeader.innerText = `Group Owners (${selectedPipeText})`;
        }

        const match = selectedPipeText.match(/\((.*?)\)/);
        const pipeName = match ? match[1] : selectedPipeText;

        const clientCards = document.querySelectorAll('.client-grid .client-card');
        clientCards.forEach(card => {
            const tags = Array.from(card.querySelectorAll('.client-pipelines .tag')).map(t => t.innerText);
            if (tags.includes(pipeName)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        // Flash lines
        const topoLines = document.querySelector('.topology-lines');
        if (topoLines) {
            topoLines.style.opacity = '0';
            setTimeout(() => topoLines.style.opacity = '1', 300);
        }

        // Change node statuses semi-randomly based on pipeline to show interactivity
        topoNodes.forEach(node => {
            const originalScale = getScale();
            node.style.transform = `translate(-50%, -50%) scale(${originalScale * 0.9})`;
            setTimeout(() => {
                node.style.transform = `translate(-50%, -50%) scale(1)`; // reset visually briefly
                const val = e.target.value;
                const h = node.querySelector('.node-header');
                const alertDiv = h ? h.querySelector('.node-alert') : null;

                if (val === 'p1') {
                    node.className = 'topo-node status-ok';
                    if (alertDiv) alertDiv.style.display = 'none';
                } else if (val === 'p2') {
                    // Keep current layout for p2
                    if (alertDiv) alertDiv.style.display = 'flex';
                } else if (val === 'p3') {
                    if (node.querySelector('.node-label').innerText === 'scheduler') {
                        node.className = 'topo-node status-error';
                    }
                }
            }, 150);
        });
    });
}

// Modal chip adder logic
const groupAdder = document.getElementById('group-adder');
const groupList = document.getElementById('pipeline-groups-list');
if (groupAdder && groupList) {
    groupAdder.addEventListener('change', (e) => {
        if (e.target.value) {
            const groupName = e.target.options[e.target.selectedIndex].text;
            // create chip
            const chip = document.createElement('div');
            chip.className = 'chip bg-primary';
            chip.style.cssText = 'background: #8b5cf6; padding: 4px 10px; border-radius: 16px; font-size: 12px; display: flex; align-items: center; gap: 6px;';

            const span = document.createElement('span');
            span.className = 'chip-text';
            span.innerText = groupName;

            const closeBtn = document.createElement('button');
            closeBtn.className = 'chip-close';
            closeBtn.style.cssText = 'background:none; border:none; color:white; cursor:pointer; display:flex; margin-left:6px;';
            closeBtn.innerHTML = '<ion-icon name="close"></ion-icon>';

            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                chip.remove();
            });

            chip.appendChild(span);
            chip.appendChild(closeBtn);
            groupList.appendChild(chip);
            e.target.value = ''; // reset
        }
    });
}

const clientGroupAdder = document.getElementById('client-group-adder');
const clientGroupList = document.getElementById('client-modal-groups');
if (clientGroupAdder && clientGroupList) {
    clientGroupAdder.addEventListener('change', (e) => {
        if (e.target.value) {
            const groupName = e.target.options[e.target.selectedIndex].text;
            // create chip
            const chip = document.createElement('div');
            chip.className = 'chip bg-primary';
            chip.style.cssText = 'background: #8b5cf6; padding: 4px 10px; border-radius: 16px; font-size: 12px; display: flex; align-items: center; gap: 6px;';

            const span = document.createElement('span');
            span.className = 'chip-text';
            span.innerText = groupName;

            const closeBtn = document.createElement('button');
            closeBtn.className = 'chip-close';
            closeBtn.style.cssText = 'background:none; border:none; color:white; cursor:pointer; display:flex; margin-left:6px;';
            closeBtn.innerHTML = '<ion-icon name="close"></ion-icon>';

            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                chip.remove();
            });

            chip.appendChild(span);
            chip.appendChild(closeBtn);
            clientGroupList.appendChild(chip);
            e.target.value = ''; // reset
        }
    });
}

// --- INTERACTIVE DRAG/PAN/ZOOM CANVAS ENGINE ---
const topoWrapper = document.querySelector('.topology-wrapper');
const topoInner = document.querySelector('.topology-inner');
const svgLayer = document.getElementById('topology-lines-svg');
let scale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;
let draggedNode = null;
let nodeStartX = 0;
let nodeStartY = 0;
window.isNodeMoved = false;

function getScale() { return scale; }

function applyTransforms() {
    if (topoInner) {
        topoInner.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        topoInner.style.transformOrigin = '0 0';
    }
}

// Dynamic Connections Map
const connections = [
    { from: 'node-push', to: 'node-get', color: 'green', dash: false },
    { from: 'node-kafka', to: 'node-get', color: 'green', dash: false },
    { from: 'node-schedule', to: 'node-get', color: 'green', dash: false },
    { from: 'node-get', to: 'node-validate', color: 'blue', dash: false },
    { from: 'node-validate', to: 'node-transform', color: 'green', dash: false },
    { from: 'node-validate', to: 'node-ext-transform', color: 'green', dash: false },
    { from: 'node-transform', to: 'node-validate', color: 'blue', dash: false, offset: 20 },
    { from: 'node-ext-transform', to: 'node-validate', color: 'blue', dash: false, offset: 20 },
    { from: 'node-validate', to: 'node-fail', color: 'red', dash: true },
    { from: 'node-validate', to: 'node-publish', color: 'green', dash: false },
    { from: 'node-validate', to: 'node-publish-store', color: 'green', dash: false }
];

function drawLines() {
    if (!svgLayer) return;
    svgLayer.innerHTML = ''; // Clear existing paths

    // Re-inject markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
            <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="28" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="rgba(16, 185, 129, 0.8)" /></marker>
            <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="28" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="rgba(59, 130, 246, 0.8)" /></marker>
            <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="28" refY="4" orient="auto"><polygon points="0 0, 8 4, 0 8" fill="rgba(239, 68, 68, 0.8)" /></marker>
        `;
    svgLayer.appendChild(defs);

    // Standard Width/Height we use as grid scale (1000x500 base)
    const innerRect = topoInner.getBoundingClientRect();

    connections.forEach(conn => {
        const el1 = document.getElementById(conn.from);
        const el2 = document.getElementById(conn.to);
        if (!el1 || !el2) return;

        // In our layout, left/top are stored as percentages inline (e.g., 5%, 15%)
        // We read them, convert to absolute (1000x500) so SVG viewport coordinates map perfectly

        const getRelativeCoords = (el) => {
            // Map the element's actual pixel offset inside its parent back to the 1000x500 SVG coordinates
            // Because parent size can change, this ensures lines stay perfectly centered on the nodes
            const x = (el.offsetLeft / el.parentElement.offsetWidth) * 1000;
            const y = (el.offsetTop / el.parentElement.offsetHeight) * 500;
            return { x, y };
        };

        let pt1 = getRelativeCoords(el1);
        let pt2 = getRelativeCoords(el2);

        // Offsets for back-loops so lines don't perfectly overlap
        if (conn.offset) {
            pt1.y += conn.offset;
            pt2.y += conn.offset;
        } else if (conn.from === conn.to) {
            // Edge case
        }

        // Calculate bezier control points for a smooth horizontal curve
        const dist = Math.abs(pt2.x - pt1.x);
        const cX = pt1.x + (dist * 0.4); // 40% forward
        const cX2 = pt2.x - (dist * 0.4); // 40% backward

        const pathInfo = `M ${pt1.x} ${pt1.y} C ${cX} ${pt1.y}, ${cX2} ${pt2.y}, ${pt2.x} ${pt2.y}`;

        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', pathInfo);
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke-width', '2');

        let colorStr = 'rgba(16, 185, 129, 0.6)';
        let markerStr = 'url(#arrow-green)';
        if (conn.color === 'blue') { colorStr = 'rgba(59, 130, 246, 0.6)'; markerStr = 'url(#arrow-blue)'; }
        if (conn.color === 'red') { colorStr = 'rgba(239, 68, 68, 0.6)'; markerStr = 'url(#arrow-red)'; }

        p.setAttribute('stroke', colorStr);
        p.setAttribute('marker-end', markerStr);
        if (conn.dash) {
            p.setAttribute('stroke-dasharray', '4,4');
            // For animation flow, red line doesn't have the main path class automatically mapped identically
        }

        svgLayer.appendChild(p);
    });
}

if (topoWrapper && topoInner) {
    // Initial Draw
    setTimeout(drawLines, 50);

    // Zoom 
    topoWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const xs = (e.clientX - topoWrapper.getBoundingClientRect().left - panX) / scale;
        const ys = (e.clientY - topoWrapper.getBoundingClientRect().top - panY) / scale;

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale += delta;
        if (scale < 0.3) scale = 0.3;
        if (scale > 3) scale = 3;

        // Adjust pan to zoom into mouse center
        panX = e.clientX - topoWrapper.getBoundingClientRect().left - xs * scale;
        panY = e.clientY - topoWrapper.getBoundingClientRect().top - ys * scale;

        applyTransforms();
    });

    // Pan Mousedown
    topoWrapper.addEventListener('mousedown', (e) => {
        // Ignore if clicking a node
        if (e.target.closest('.topo-node')) return;
        isPanning = true;
        startPanX = e.clientX - panX;
        startPanY = e.clientY - panY;
        topoWrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        // Handle Pan
        if (isPanning) {
            panX = e.clientX - startPanX;
            panY = e.clientY - startPanY;
            applyTransforms();
        }
        // Handle Drag Node
        if (draggedNode) {
            window.isNodeMoved = true;
            // Canvas is 1000x500 base size. 
            const rect = topoInner.getBoundingClientRect();
            // Map screen coordinates back to inner unscaled pixel coordinates
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            draggedNode.style.left = `${x}px`;
            draggedNode.style.top = `${y}px`;
            drawLines();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            topoWrapper.style.cursor = 'grab';
        }
        if (draggedNode) {
            draggedNode.classList.remove('dragging');
            draggedNode = null;
            setTimeout(() => { window.isNodeMoved = false; }, 50);
        }
    });

    // Initialize drag on nodes
    topoNodes.forEach(node => {
        node.addEventListener('mousedown', (e) => {
            // If it's the node-header being clicked but not the specific ionic icon for settings
            e.stopPropagation();
            draggedNode = node;
            node.classList.add('dragging');
        });

        // Adjust onclick to not trigger during drag
        node.addEventListener('click', (e) => {
            // The onclick is handled globally via HTML attribute right now (openPodConfig),
            // it might need preventDefault if dragging occurred.
        });
    });
}

// Pod Configuration Logic
function openPodConfig(serviceName, cpuVal, memVal) {
    if (window.isNodeMoved) return; // Prevent click event if dragging

    const titleEl = document.getElementById('pod-modal-title');
    if (titleEl) titleEl.innerText = serviceName.toUpperCase();

    // Fetch active pipeline assignment
    const pipeSwitcher = document.getElementById('pipeline-switcher');
    const pipeModalAssign = document.getElementById('pod-modal-pipeline');
    if (pipeSwitcher && pipeModalAssign && pipeSwitcher.options.length > 0) {
        pipeModalAssign.innerText = pipeSwitcher.options[pipeSwitcher.selectedIndex].text;
    }

    const cpuEl = document.getElementById('pod-cpu-val');
    const cpuSlider = document.getElementById('pod-cpu-slider');
    if (cpuEl && cpuSlider) {
        cpuEl.value = cpuVal;
        cpuSlider.value = cpuVal;
    }

    const memEl = document.getElementById('pod-mem-val');
    const memSlider = document.getElementById('pod-mem-slider');
    if (memEl && memSlider) {
        memEl.value = memVal;
        memSlider.value = memVal;
    }

    openModal('pod-config-modal');
}
