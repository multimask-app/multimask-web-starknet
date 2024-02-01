import { ReactFlow } from 'reactflow'

import 'reactflow/dist/style.css'

export default function () {
  const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'If NFT balance > 0' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: 'Transfer NFT to 0xxxxxxx' } },
  ]
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]
  return (
    <div>
      <div className="flex-center py-8">Coming Soon</div>
      <div style={{ width: '60vw', height: '40vh' }} className="hidden">
        <ReactFlow nodes={initialNodes} edges={initialEdges} />
      </div>
    </div>
  )
}
