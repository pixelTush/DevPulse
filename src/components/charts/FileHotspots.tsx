import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FileHotspot {
  filename: string;
  modifications: number;
}

interface FileHotspotsProps {
  data: FileHotspot[];
}

const FileHotspots: React.FC<FileHotspotsProps> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ gridColumn: 'span 4', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No hotspot data available.</p>
      </div>
    );
  }

  // Take top 8 most modified files
  const chartData = [...data].sort((a, b) => b.modifications - a.modifications).slice(0, 8);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', maxWidth: '250px' }}>
          <p style={{ margin: 0, fontWeight: 600, wordBreak: 'break-all' }}>{data.filename}</p>
          <p style={{ margin: '4px 0 0 0', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
            {data.modifications} modification{data.modifications > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ gridColumn: 'span 4', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>File Hotspots</h2>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="filename" 
              type="category" 
              width={100} 
              tickFormatter={(val) => val.split('/').pop()} // Show only filename, not full path
              stroke="var(--text-muted)" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="modifications" fill="var(--accent-secondary)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FileHotspots;
