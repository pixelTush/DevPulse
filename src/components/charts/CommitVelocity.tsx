import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CommitActivity } from '../../services/githubApi';
import { format } from 'date-fns';

interface CommitVelocityProps {
  data: CommitActivity[];
}

const CommitVelocity: React.FC<CommitVelocityProps> = ({ data }) => {
  // Map GitHub data (array of weeks) to Recharts format
  // The 'week' is a Unix timestamp
  const chartData = (Array.isArray(data) ? data : []).map((weekData) => {
    return {
      date: format(new Date(weekData.week * 1000), 'MMM dd'),
      commits: weekData.total,
    };
  });

  return (
    <div className="glass-panel animate-fade-in" style={{ gridColumn: 'span 12', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Commit Velocity (Past Year)</h2>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Area type="monotone" dataKey="commits" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommitVelocity;
