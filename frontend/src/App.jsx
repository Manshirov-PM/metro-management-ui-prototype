import { useEffect, useState } from 'react'
import { fetchPipelines, fetchNotifications } from './lib/api'
import PipelineTable from './components/PipelineTable'
import ResourceMonitoring from './components/ResourceMonitoring'
import SlaPerformance from './components/SlaPerformance'
import NotificationCenter from './components/NotificationCenter'
import TopologyCanvas from './features/topology/TopologyCanvas'
import PodConfigModal from './components/modals/PodConfigModal'
import SystemHealth from './components/SystemHealth'
import GroupOwners from './features/clients/GroupOwners'
import AddClientModal from './components/modals/AddClientModal'
import CreatePipelineModal from './components/modals/CreatePipelineModal'
import TeamModal from './components/modals/TeamModal'
import ThemeChooser from './components/ThemeChooser'
import { LucidePlusCircle, LucideUserPlus, LucideCheckCircle } from 'lucide-react'

function App() {
  const [pipelines, setPipelines] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Layout State
  const [activeTab, setActiveTab] = useState('admin')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

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
          <ThemeChooser />
          {/* Reusable Notification Center Component */}
          <NotificationCenter notifications={notifications} />

          <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-bgInput border border-borderC transition-colors" title="Developer Team" onClick={() => setIsTeamModalOpen(true)}>
            AD
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="border-b border-borderC bg-bgCard mt-16 sticky top-16 z-40 px-8 flex gap-8">
        <button
          className={`py-4 font-bold border-b-2 transition-colors cursor-pointer bg-transparent ${activeTab === 'admin' ? 'border-primary text-primary' : 'border-transparent text-textMuted hover:text-white'}`}
          onClick={() => setActiveTab('admin')}
        >
          Platform Administration
        </button>
        <button
          className={`py-4 font-bold border-b-2 transition-colors cursor-pointer bg-transparent ${activeTab === 'business' ? 'border-primary text-primary' : 'border-transparent text-textMuted hover:text-white'}`}
          onClick={() => setActiveTab('business')}
        >
          Business Dashboard
        </button>
      </div>

      <main className="p-8 max-w-[1400px] mx-auto pt-8">
        {activeTab === 'admin' && (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PipelineTable pipelines={pipelines} />

              <div className="flex flex-col gap-6">
                <ResourceMonitoring onScaleUp={handleNodeClick} />
                <SlaPerformance />
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
          </>
        )}

        {/* Business Dashboard View */}
        {activeTab === 'business' && (
          <div className="card h-[800px]">
            <div className="card-header bg-bgCard border-b border-borderC px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="m-0 text-lg text-primary font-bold tracking-tight">Qlik Business Insights</h3>
                <p className="text-textMuted text-xs m-0">Live aggregated metrics and client analytics mapping.</p>
              </div>
            </div>
            <div className="card-body p-0 bg-white">
              <iframe
                src="https://sense-demo.qlik.com/single/?appid=1333cc5e-6962-4b71-9f93-fb3d83764b85&sheet=b3887c12-70b9-4a0b-a010-85f26ff0167c&opt=ctxmenu,currsel"
                className="w-full h-full border-none"
                title="Qlik Dashboard"
              ></iframe>
            </div>
          </div>
        )}

        {/* Global Success Toast */}
        {toastMessage && (
          <div className="fixed bottom-8 right-8 bg-success font-bold text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-[100] border border-success/50 backdrop-blur-md">
            <LucideCheckCircle size={20} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modals */}
        <PodConfigModal
          isOpen={isPodConfigOpen}
          onClose={() => setIsPodConfigOpen(false)}
          pod={selectedPod}
          pipeline={activePipeline}
          clusterStats={{ used: 210, total: 500 }}
        />
        <AddClientModal
          isOpen={isAddClientOpen}
          onClose={() => setIsAddClientOpen(false)}
          pipelines={pipelines}
          onSuccess={() => { setIsAddClientOpen(false); showToast("Client access successfully linked to Pipeline!"); loadData(); }}
        />
        <CreatePipelineModal
          isOpen={isCreatePipelineOpen}
          onClose={() => setIsCreatePipelineOpen(false)}
          onSuccess={() => { setIsCreatePipelineOpen(false); showToast("New Core Pipeline provisioned across clusters!"); loadData(); }}
        />
        <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
      </main>
    </div>
  )
}

export default App
