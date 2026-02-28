import { useEffect, useState } from 'react'
import { fetchPipelines, fetchNotifications } from './lib/api'
import PipelineTable from './components/PipelineTable'
import NotificationCenter from './components/NotificationCenter'
import TopologyCanvas from './features/topology/TopologyCanvas'
import PodConfigModal from './components/modals/PodConfigModal'
import SystemHealth from './components/SystemHealth'
import GroupOwners from './features/clients/GroupOwners'
import AddClientModal from './components/modals/AddClientModal'
import CreatePipelineModal from './components/modals/CreatePipelineModal'
import TeamModal from './components/modals/TeamModal'
import { LucidePlusCircle, LucideUserPlus } from 'lucide-react'

function App() {
  const [pipelines, setPipelines] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Topology State
  const [selectedPipelineId, setSelectedPipelineId] = useState(null)

  // Modals Local State
  const [isPodConfigOpen, setIsPodConfigOpen] = useState(false)
  const [selectedPod, setSelectedPod] = useState(null)
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isCreatePipelineOpen, setIsCreatePipelineOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)

  const loadData = async () => {
    try {
      const [pipes, notifs] = await Promise.all([
        fetchPipelines(),
        fetchNotifications()
      ]);
      setPipelines(pipes);
      setNotifications(notifs);
    } catch (e) {
      console.error("Failed to load backend data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [])

  useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId])

  const activePipeline = pipelines.find(p => p.id === selectedPipelineId);

  const handleNodeClick = (node) => {
    // Optional: lookup real pod limits if mapping exists, else just open modal with defaults
    setSelectedPod(node);
    setIsPodConfigOpen(true);
  }

  if (loading) return <div className="flex h-screen bg-bgMain items-center justify-center text-primary font-bold text-xl">Loading Metro Platform...</div>

  return (
    <div className="App bg-bgMain min-h-screen text-textMain pb-20">
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-bgCard border-b border-borderC z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primaryHover shadow-lg shadow-primaryHover/30 flex items-center justify-center text-white font-black italic tracking-tighter">
            M
          </div>
          <h1 className="text-xl font-bold tracking-tight">Metro <span className="text-textMuted font-normal text-sm ml-2">v2.0 FullStack Control</span></h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Reusable Notification Center Component */}
          <NotificationCenter notifications={notifications} />

          <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-bgInput border border-borderC transition-colors" title="Developer Team" onClick={() => setIsTeamModalOpen(true)}>
            AD
          </div>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto mt-16 pt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Infrastructure Overview</h2>
          <div className="flex gap-3">
            <button className="btn btn-secondary flex items-center gap-2" onClick={() => setIsAddClientOpen(true)}>
              <LucideUserPlus size={16} /> Add Client
            </button>
            <button className="btn btn-primary shadow-lg shadow-primary/20 flex items-center gap-2" onClick={() => setIsCreatePipelineOpen(true)}>
              <LucidePlusCircle size={16} /> Create Pipeline
            </button>
          </div>
        </div>

        <SystemHealth />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Reusable Pipeline Table Component */}
          <PipelineTable pipelines={pipelines} />

          {/* Placeholder for Resource Monitoring */}
          <div className="card">
            <div className="card-header">
              <h3>Resource Monitoring</h3>
            </div>
            <div className="card-body">
              {pipelines.flatMap(p => p.pods).map(pod => (
                <div key={pod.id} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold">{pod.name}</span>
                    <span className="text-warning">85% Utilized</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-textMuted">Memory hitting threshold</span>
                    <button className="btn bg-primary/20 text-primary hover:bg-primary hover:text-white px-2 py-1 text-xs rounded transition-colors">Scale Up</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Microservices Interactive Topology */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold tracking-tight">Interactive Topology</h2>

            <select
              className="bg-bgInput border border-borderC text-textMain rounded-md px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary"
              value={selectedPipelineId || ''}
              onChange={e => setSelectedPipelineId(e.target.value)}
            >
              <optgroup label="Pipelines">
                {pipelines.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <TopologyCanvas activePipeline={activePipeline} onNodeClick={handleNodeClick} />
        </div>

        {/* Group Owners Directory (Clients) */}
        <GroupOwners activePipeline={activePipeline} />

        {/* Modals */}
        <PodConfigModal
          isOpen={isPodConfigOpen}
          onClose={() => setIsPodConfigOpen(false)}
          pod={selectedPod}
          pipeline={activePipeline}
          clusterStats={{ used: 210, total: 500 }}
        />
        <AddClientModal isOpen={isAddClientOpen} onClose={() => setIsAddClientOpen(false)} pipelines={pipelines} onSuccess={loadData} />
        <CreatePipelineModal isOpen={isCreatePipelineOpen} onClose={() => setIsCreatePipelineOpen(false)} onSuccess={loadData} />
        <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
      </main>
    </div>
  )
}

export default App
