import React from 'react'

export default function MissionBanner({ week, mission }) {
  return (
    <div className="p-3 rounded-xl" style={{ background: 'rgba(64,196,255,0.06)', border: '1px solid rgba(64,196,255,0.16)' }}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">🎯</div>
        <div className="text-sm text-blue-300">{mission?.title || `Week ${week} Mission`}</div>
      </div>
    </div>
  )
}
