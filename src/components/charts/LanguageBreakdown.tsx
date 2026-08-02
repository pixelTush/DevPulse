import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LanguageBreakdownProps {
  data: Record<string, number>;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const LanguageBreakdown: React.FC<LanguageBreakdownProps> = ({ data }) => {
  // Convert Record<string, number> to array of objects
  const safeData = (data && typeof data === 'object') ? data : {};
  const totalBytes = Object.values(safeData).reduce((acc: any, val: any) => acc + val, 0);
  
  const chartData = Object.entries(safeData)
    .map(([name, value]) => ({
      name,
      value,
      percentage: ((value / totalBytes) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 languages to keep it clean

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{data.name}</p>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ gridColumn: 'span 4', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Language Breakdown</h2>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LanguageBreakdown;
