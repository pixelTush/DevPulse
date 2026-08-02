import { fetchRepoInfo, fetchCommitActivity, fetchContributors, fetchLanguages, fetchRecentCommits } from './githubApi';

async function test() {
  console.log('Testing GitHub API Service...');
  try {
    const owner = process.argv[2] || 'facebook';
    const repo = process.argv[3] || 'react';
    
    console.log(`Fetching Repo Info for ${owner}/${repo}...`);
    const info = await fetchRepoInfo(owner, repo);
    console.log(`Success! Found repo: ${info.full_name}`);
    
    console.log(`Fetching Languages...`);
    const langs = await fetchLanguages(owner, repo);
    console.log(`Success! Languages:`, Object.keys(langs).slice(0, 3));
    
    console.log(`Fetching Commit Activity...`);
    const activity = await fetchCommitActivity(owner, repo);
    console.log(`Success! Activity weeks:`, activity.length);
    
    console.log(`Fetching Contributors...`);
    const contribs = await fetchContributors(owner, repo);
    console.log(`Success! Contributors count:`, contribs.length);
    
    console.log(`Fetching Recent Commits...`);
    const commits = await fetchRecentCommits(owner, repo, undefined, 2);
    console.log(`Success! Recent commits count:`, commits.length);
    
    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
