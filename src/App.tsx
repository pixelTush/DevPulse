import { useState } from 'react';
import SearchBar from './components/SearchBar';
import CommitVelocity from './components/charts/CommitVelocity';
import LanguageBreakdown from './components/charts/LanguageBreakdown';
import ContributorChurn from './components/charts/ContributorChurn';
import FileHotspots from './components/charts/FileHotspots';
import { 
  fetchRepoInfo, 
  fetchCommitActivity, 
  fetchContributors, 
  fetchLanguages, 
  fetchRecentCommits, 
  fetchCommitDetails
} from './services/githubApi';
import type { RepoInfo, CommitActivity, Contributor } from './services/githubApi';

function App() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [commitActivity, setCommitActivity] = useState<CommitActivity[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [fileHotspots, setFileHotspots] = useState<{filename: string, modifications: number}[]>([]);

  const handleSearch = async (owner: string, repo: string) => {
    setLoading(true);
    setError('');
    setRepoInfo(null);
    setCommitActivity([]);
    setContributors([]);
    setLanguages({});
    setFileHotspots([]);

    try {
      // Fetch high-level stats in parallel
      const [info, activity, contribs, langs] = await Promise.all([
        fetchRepoInfo(owner, repo, token),
        fetchCommitActivity(owner, repo, token),
        fetchContributors(owner, repo, token),
        fetchLanguages(owner, repo, token)
      ]);

      setRepoInfo(info);
      setCommitActivity(activity);
      setContributors(contribs);
      setLanguages(langs);

      // Fetch file hotspots (scan recent commits)
      // Limit to 15 commits if no token to save API limits
      const commitsToScan = token ? 30 : 10;
      const recentCommits = await fetchRecentCommits(owner, repo, token, commitsToScan);
      
      const fileCounts: Record<string, number> = {};
      
      // Fetch details sequentially or chunked to avoid blowing up rate limits simultaneously
      for (const commit of recentCommits) {
        try {
          const details = await fetchCommitDetails(owner, repo, commit.sha, token);
          details.files?.forEach((file: any) => {
            fileCounts[file.filename] = (fileCounts[file.filename] || 0) + 1;
          });
        } catch (e) {
          console.warn(`Failed to fetch details for commit ${commit.sha}`);
        }
      }

      const hotspots = Object.entries(fileCounts).map(([filename, modifications]) => ({
        filename,
        modifications
      }));

      setFileHotspots(hotspots);

    } catch (err: any) {
      console.error(err);
      if (err.message.includes('Rate limit exceeded') || err.message.includes('403')) {
        setError('GitHub API rate limit exceeded. Please provide a Personal Access Token to continue.');
      } else if (err.message.includes('Not found') || err.message.includes('404')) {
        setError('Repository not found. Please check the spelling.');
      } else {
        setError('An error occurred while fetching repository data: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <SearchBar onSearch={handleSearch} onTokenChange={setToken} token={token} />
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div className="animate-fade-in" style={{ fontSize: '1.2rem' }}>Fetching repository data...</div>
          <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>This may take a moment while we scan file hotspots.</div>
        </div>
      )}

      {error && (
        <div className="glass-panel animate-fade-in" style={{ border: '1px solid #f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>
          <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Error</h3>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {!loading && !error && repoInfo && (
        <div className="animate-slide-up">
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img src={repoInfo.owner.avatar_url} alt="Owner" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{repoInfo.full_name}</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
                ⭐ {repoInfo.stargazers_count.toLocaleString()} • 🍴 {repoInfo.forks_count.toLocaleString()} • 🐛 {repoInfo.open_issues_count.toLocaleString()} issues
              </p>
            </div>
          </div>
          
          <div className="dashboard-grid">
            <CommitVelocity data={commitActivity} />
            <LanguageBreakdown data={languages} />
            <ContributorChurn data={contributors} />
            <FileHotspots data={fileHotspots} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
