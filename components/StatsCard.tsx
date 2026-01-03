import React from 'react'

interface StatsCardProps {
  headerTitle: string;
  total: number;
  currentMonthCount: number;
  lastMonthCount: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ headerTitle, total, currentMonthCount, lastMonthCount }) => {
  return (
    <div className="stats-card">
      <h3>{headerTitle}</h3>
      <p>Total: {total}</p>
      <p>Current Month: {currentMonthCount}</p>
      <p>Last Month: {lastMonthCount}</p>
    </div>
  )
}

export default StatsCard
