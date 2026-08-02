import React from 'react';
import type { Contributor } from '../../services/githubApi';

interface ContributorChurnProps {
  data: Contributor[];
}

const ContributorChurn: React.FC<ContributorChurnProps> = ({ data }) => {
  // Sort by total commits, take top 5
  const topContributors = (Array.isArray(data) ? [...data] : []).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="glass-panel animate-fade-in" style={{ gridColumn: 'span 4', height: '350px', overflowY: 'auto' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Top Contributors</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {topContributors.map((contributor) => {
          // Calculate total additions and deletions
          let add = 0;
          let del = 0;
          contributor.weeks.forEach(w => {
            add += w.a;
            del += w.d;
          });

          return (
            <div key={contributor.author.login} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={contributor.author.avatar_url} 
                alt={contributor.author.login} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border-glass)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500 }}>{contributor.author.login}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{contributor.total} commits</span>
                </div>
                {/* Visualizer bars for additions/deletions */}
                <div style={{ display: 'flex', gap: '2px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ 
                      width: `${(add / (add + del || 1)) * 100}%`, 
                      backgroundColor: '#10b981', 
                      minWidth: add > 0 ? '5%' : '0' 
                    }} 
                    title={`${add} Additions`} 
                  />
                  <div style={{ 
                      width: `${(del / (add + del || 1)) * 100}%`, 
                      backgroundColor: '#f43f5e', 
                      minWidth: del > 0 ? '5%' : '0' 
                    }} 
                    title={`${del} Deletions`} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                  <span style={{ color: '#10b981' }}>+{add}</span>
                  <span style={{ color: '#f43f5e' }}>-{del}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContributorChurn;
