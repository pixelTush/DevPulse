import React, { useState } from 'react';
import { Search, Key } from 'lucide-react';

interface SearchBarProps {
  onSearch: (owner: string, repo: string) => void;
  onTokenChange: (token: string) => void;
  token: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onTokenChange, token }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;

    let owner = '';
    let repo = '';

    // Handle URL or owner/repo format
    try {
      if (inputValue.includes('github.com')) {
        const url = new URL(inputValue);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
        }
      } else {
        const parts = inputValue.split('/');
        if (parts.length === 2) {
          owner = parts[0];
          repo = parts[1];
        }
      }
    } catch (err) {
      // Ignore URL parsing errors and try split
    }

    if (owner && repo) {
      onSearch(owner, repo);
    } else {
      alert('Please enter a valid GitHub repository URL or owner/repo format.');
    }
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 className="text-gradient" style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>DevPulse</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Analyze any public GitHub repository</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="glass-input" 
            style={{ paddingLeft: '48px' }}
            placeholder="e.g. facebook/react or https://github.com/microsoft/vscode" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Key size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              className="glass-input" 
              style={{ paddingLeft: '40px', fontSize: '0.9rem' }}
              placeholder="GitHub PAT (Optional)" 
              value={token}
              onChange={(e) => onTokenChange(e.target.value)}
              title="Providing a Personal Access Token increases API rate limits and is required for deep file hotspots analysis."
            />
          </div>
          <button type="submit" className="glass-button">
            Analyze
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
