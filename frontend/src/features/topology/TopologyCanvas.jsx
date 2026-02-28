import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LucideSettings, LucideAlertTriangle, LucideServer, LucideDatabase } from 'lucide-react';

const INITIAL_NODES = [
    { id: 'push-data', label: 'push-data', x: 100, y: 250, type: 'kafka-topic' },
    { id: 'kafka-consumer', label: 'kafka-consumer', x: 250, y: 250, type: 'metro-service' },
    { id: 'scheduler', label: 'scheduler', x: 400, y: 250, type: 'metro-service' },
    { id: 'python-validate-1', label: 'python-validate-1', x: 550, y: 250, type: 'metro-service' },
    { id: 'transform-data', label: 'transform-data', x: 700, y: 125, type: 'metro-service', optional: true },
    { id: 'external-transform', label: 'external-transform', x: 850, y: 125, type: 'metro-service', optional: true },
    { id: 'node-fail', label: 'informative-validate (fail)', x: 550, y: 375, type: 'error' },
    { id: 'node-publish', label: 'publish', x: 850, y: 150, type: 'kafka-topic' },
    { id: 'node-publish-store', label: 'publish-storages', x: 850, y: 375, type: 'metro-service' }
];

const CONNECTIONS = [
    { from: 'push-data', to: 'kafka-consumer' },
    { from: 'kafka-consumer', to: 'scheduler' },
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
        // Basic bezier curve routing x -> +50, y -> same, target -> x-50
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
            style={{ cursor: 'grab', background: '#0a0c10', backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.05) 2px, transparent 0)', backgroundSize: '40px 40px', backgroundPosition: `${pan.x}px ${pan.y}px` }}
        >
            <div className="absolute top-4 left-4 z-10 flex gap-4">
                <div className="bg-bgInput px-4 py-2 rounded-full border border-borderC text-primary font-bold text-sm shadow-lg">
                    Pipeline: {activePipeline?.name || 'Loading...'}
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
                                    'bg-bgInput text-white border-borderC hover:border-textMuted'}`}
                        >
                            {node.type === 'kafka-topic' ? <LucideDatabase size={20} /> :
                                node.type === 'error' ? <LucideAlertTriangle size={20} /> : 'M'}
                        </div>
                        <span className="mt-2 text-xs font-bold text-center w-32 drop-shadow-md bg-black/50 px-2 py-1 rounded">
                            {node.label}
                        </span>
                        {node.optional && <span className="absolute -top-2 -right-2 bg-warning text-black text-[9px] px-1 rounded font-bold">OPT</span>}
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
