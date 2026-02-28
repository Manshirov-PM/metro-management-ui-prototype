import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LucideSettings, LucideAlertTriangle, LucideServer, LucideDatabase, LucideEdit2, LucideCheck } from 'lucide-react';

const INITIAL_NODES = [
    { id: 'push-data', label: 'push-data', x: 100, y: 100, type: 'kafka-topic' },
    { id: 'kafka-consumer', label: 'kafka-consumer', x: 100, y: 220, type: 'metro-service' },
    { id: 'scheduler', label: 'scheduler', x: 100, y: 340, type: 'metro-service' },
    { id: 'python-validate-1', label: 'python-validate-1', x: 350, y: 220, type: 'metro-service', needsScaling: true },
    { id: 'transform-data', label: 'transform-data', x: 500, y: 100, type: 'metro-service', optional: true },
    { id: 'external-transform', label: 'external-transform', x: 650, y: 100, type: 'metro-service', optional: true },
    { id: 'node-fail', label: 'informative-validate (fail)', x: 500, y: 340, type: 'error' },
    { id: 'node-publish', label: 'publish', x: 700, y: 220, type: 'kafka-topic' },
    { id: 'node-publish-store', label: 'publish-storages', x: 700, y: 340, type: 'metro-service' }
];

const CONNECTIONS = [
    { from: 'push-data', to: 'python-validate-1' },
    { from: 'kafka-consumer', to: 'python-validate-1' },
    { from: 'scheduler', to: 'python-validate-1' },
    { from: 'python-validate-1', to: 'transform-data' },
    { from: 'transform-data', to: 'external-transform' },
    { from: 'external-transform', to: 'python-validate-1' },
    { from: 'python-validate-1', to: 'node-fail' },
    { from: 'python-validate-1', to: 'node-publish' },
    { from: 'python-validate-1', to: 'node-publish-store' }
];

export default function TopologyCanvas({ activePipeline, onNodeClick }) {
    const [nodes, setNodes] = useState(INITIAL_NODES);
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    // Inline Edit State
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [isEditingPush, setIsEditingPush] = useState(false);
    const [editPushVal, setEditPushVal] = useState('');
    const [isEditingPull, setIsEditingPull] = useState(false);
    const [editPullVal, setEditPullVal] = useState('');

    useEffect(() => {
        if (activePipeline) {
            setEditName(activePipeline.name);
            setEditDesc(activePipeline.description);
            setEditPushVal(activePipeline.pushLimit);
            setEditPullVal(activePipeline.pullLimit);
        }
    }, [activePipeline]);

    const containerRef = useRef(null);
    const isDraggingNode = useRef(false);
    const draggedNodeId = useRef(null);
    const hasDragged = useRef(false);
    const isPanning = useRef(false);
    const startPan = useRef({ x: 0, y: 0 });

    // Handle Mouse Down
    const handleMouseDown = (e, nodeId = null) => {
        if (nodeId) {
            hasDragged.current = false;
            isDraggingNode.current = true;
            draggedNodeId.current = nodeId;
        } else {
            isPanning.current = true;
            startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
        }
    };

    // Handle Mouse Move
    const handleMouseMove = useCallback((e) => {
        if (isDraggingNode.current && draggedNodeId.current) {
            hasDragged.current = true;
            const containerRect = containerRef.current.getBoundingClientRect();
            const newX = (e.clientX - containerRect.left - pan.x) / scale;
            const newY = (e.clientY - containerRect.top - pan.y) / scale;

            setNodes(prev => prev.map(n =>
                n.id === draggedNodeId.current ? { ...n, x: newX, y: newY } : n
            ));
        } else if (isPanning.current) {
            setPan({
                x: e.clientX - startPan.current.x,
                y: e.clientY - startPan.current.y
            });
        }
    }, [scale, pan]);

    // Handle Mouse Up
    const handleMouseUp = useCallback(() => {
        if (isDraggingNode.current) {
            // Small timeout prevents click firing right after drag
            setTimeout(() => { isDraggingNode.current = false; draggedNodeId.current = null; }, 50);
        }
        if (isPanning.current) {
            isPanning.current = false;
            if (containerRef.current) containerRef.current.style.cursor = 'grab';
        }
    }, []);

    // Handle Zoom
    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const zoomIntensity = 0.001;
        const scroll = e.deltaY;

        setScale(prev => {
            let newScale = prev - (scroll * zoomIntensity);
            if (newScale < 0.3) newScale = 0.3;
            if (newScale > 2.5) newScale = 2.5;
            return newScale;
        });
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel]);

    // SVG Line Path Generator
    const generatePath = (start, end) => {
        // If they are vertically aligned (e.g., Push -> Kafka -> Scheduler)
        if (Math.abs(start.x - end.x) < 20) {
            const dy = Math.abs(end.y - start.y) * 0.5;
            // Sweep right by 100px then back
            return `M ${start.x} ${start.y} C ${start.x + 100} ${start.y + (dy * 0.5)}, ${end.x + 100} ${end.y - (dy * 0.5)}, ${end.x} ${end.y}`;
        }

        // Default Horizontal routing
        const dx = Math.abs(end.x - start.x) * 0.5;
        return `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;
    };

    return (
        <div className="card col-span-2 relative h-[500px] overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
            onMouseDown={(e) => handleMouseDown(e)}
            style={{ cursor: 'grab', background: 'var(--color-bgMain, #0a0812)', backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(139, 92, 246, 0.05) 2px, transparent 0)', backgroundSize: '40px 40px', backgroundPosition: `${pan.x}px ${pan.y}px` }}
        >
            <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 pointer-events-auto">
                <div className="bg-bgInput/90 backdrop-blur px-4 py-2 rounded-xl border border-borderC shadow-lg flex flex-col max-w-[300px]">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-primary font-bold m-0">{activePipeline?.name || 'Loading...'}</h3>
                        <button className="text-textMuted hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer">
                            <LucideSettings size={14} />
                        </button>
                    </div>
                    <p className="text-xs text-textMuted m-0 whitespace-nowrap overflow-hidden text-ellipsis">
                        {activePipeline?.description || 'Core data ingestion and streaming pathway.'}
                    </p>
                </div>

                <div className="flex gap-2 items-center">
                    {/* Rate Limits Module */}
                    <div className="bg-bgInput/90 backdrop-blur p-1 rounded-full border border-borderC shadow-lg flex items-center gap-1">
                        {/* Push Limit */}
                        {isEditingPush ? (
                            <div className="flex items-center text-sm bg-success/10 rounded-full py-1 pr-1 pl-1.5 gap-1 border border-success/40">
                                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">PSH</div>
                                <input type="number" autoFocus value={editPushVal} onChange={e => setEditPushVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && setIsEditingPush(false)} className="w-16 bg-transparent border-b border-success outline-none text-white text-center font-bold text-sm" />
                                <button onClick={() => setIsEditingPush(false)} className="bg-success text-white p-1 rounded-full border-none cursor-pointer flex"><LucideCheck size={12} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center text-sm bg-success/10 rounded-full py-1 pr-2 pl-1.5 gap-1.5 border border-success/20 cursor-pointer hover:bg-success/20 transition-colors group" onClick={() => setIsEditingPush(true)} title="Edit Max Push Rate">
                                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)] text-[10px] font-bold">PSH</div>
                                <strong className="text-textMain">{Number(editPushVal || 10000).toLocaleString()}</strong>
                                <span className="text-textMuted text-xs font-bold">/s</span>
                                <LucideEdit2 size={12} className="text-textMuted opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                            </div>
                        )}

                        {/* Pull Limit */}
                        {isEditingPull ? (
                            <div className="flex items-center text-sm bg-info/10 rounded-full py-1 pr-1 pl-1.5 gap-1 border border-info/40">
                                <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">GET</div>
                                <input type="number" autoFocus value={editPullVal} onChange={e => setEditPullVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && setIsEditingPull(false)} className="w-16 bg-transparent border-b border-info outline-none text-white text-center font-bold text-sm" />
                                <button onClick={() => setIsEditingPull(false)} className="bg-info text-white p-1 rounded-full border-none cursor-pointer flex"><LucideCheck size={12} /></button>
                            </div>
                        ) : (
                            <div className="flex items-center text-sm bg-info/10 rounded-full py-1 pr-2 pl-1.5 gap-1.5 border border-info/20 cursor-pointer hover:bg-info/20 transition-colors group" onClick={() => setIsEditingPull(true)} title="Edit Max Pull Rate">
                                <div className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] text-[10px] font-bold">GET</div>
                                <strong className="text-textMain">{Number(editPullVal || 50000).toLocaleString()}</strong>
                                <span className="text-textMuted text-xs font-bold">/s</span>
                                <LucideEdit2 size={12} className="text-textMuted opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                            </div>
                        )}
                    </div>

                    {/* Data Streaming Metric */}
                    <div className="bg-bgInput/90 backdrop-blur px-3 py-2 rounded-full border border-borderC shadow-lg flex items-center gap-2 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                        <span className="text-white">1.2 GB</span>
                        <select className="bg-transparent border-none text-textMuted outline-none cursor-pointer">
                            <option>Last 1 Hr</option>
                            <option>Last 24 Hr</option>
                        </select>
                    </div>

                    {/* Grafana Link */}
                    <a href="http://grafana.internal.net" target="_blank" className="bg-[#f05a28]/10 hover:bg-[#f05a28]/20 text-[#f05a28] px-3 py-2 rounded-full border border-[#f05a28]/30 shadow-lg flex items-center gap-1.5 text-xs font-bold transition-colors no-underline">
                        Grafana
                    </a>
                </div>
            </div>

            <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: '0 0', width: '1000px', height: '500px', position: 'relative' }}>

                {/* SVG Lines */}
                <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-0" style={{ filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.5))' }}>
                    {CONNECTIONS.map((conn, idx) => {
                        const startNode = nodes.find(n => n.id === conn.from);
                        const endNode = nodes.find(n => n.id === conn.to);
                        if (!startNode || !endNode) return null;

                        return (
                            <g key={idx}>
                                {/* Background Line */}
                                <path d={generatePath(startNode, endNode)} fill="none" stroke="#2a2d42" strokeWidth="6" />
                                {/* Foreground Animated Line */}
                                <path d={generatePath(startNode, endNode)} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="10 5"
                                    style={{ animation: 'dash 20s linear infinite' }} />
                            </g>
                        )
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <div key={node.id}
                        className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-100 hover:scale-105 select-none z-10
                ${isDraggingNode.current && draggedNodeId.current === node.id ? 'scale-110 z-50' : ''}`}
                        style={{ left: node.x, top: node.y }}
                        onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, node.id); }}
                        onClick={() => {
                            if (!hasDragged.current) {
                                onNodeClick && onNodeClick(node);
                            }
                        }}
                    >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shadow-xl border-2
               ${node.type === 'kafka-topic' ? 'bg-primary/20 text-primary border-primary' :
                                node.type === 'error' ? 'bg-danger/20 text-danger border-danger' :
                                    'bg-bgInput text-white border-borderC hover:border-textMuted'}
               ${node.needsScaling ? 'ring-[3px] ring-danger/50 ring-offset-2 ring-offset-bgMain animate-pulse' : ''}`}
                        >
                            {node.type === 'kafka-topic' ? <LucideDatabase size={20} /> :
                                node.type === 'error' ? <LucideAlertTriangle size={20} /> : 'M'}
                        </div>
                        <span className="mt-2 text-xs font-bold text-center w-32 drop-shadow-md bg-black/50 px-2 py-1 rounded">
                            {node.label}
                        </span>
                        {node.optional && <span className="absolute -top-2 -right-2 bg-warning text-black text-[9px] px-1 rounded font-bold z-20">OPT</span>}
                        {node.needsScaling && <span className="absolute -top-2 -left-2 bg-danger text-white p-1 rounded-full z-20" title="High CPU/Mem - Click to Scale Resources"><LucideAlertTriangle size={12} /></span>}
                    </div>
                ))}

            </div>

            <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
      `}</style>
        </div>
    );
}
