export interface RepoInfo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    avatar_url: string;
    login: string;
  };
}

export interface CommitActivity {
  days: number[];
  total: number;
  week: number;
}

export interface Contributor {
  author: {
    login: string;
    avatar_url: string;
  };
  total: number;
  weeks: {
    w: number;
    a: number;
    d: number;
    c: number;
  }[];
}

const BASE_URL = 'https://api.github.com';

const getHeaders = (token?: string) => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
};

export const fetchRepoInfo = async (owner: string, repo: string, token?: string): Promise<RepoInfo> => {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}`, { headers: getHeaders(token) });
  if (!response.ok) {
    if (response.status === 403) throw new Error('Rate limit exceeded');
    if (response.status === 404) throw new Error('Not found');
    throw new Error(response.statusText);
  }
  return response.json();
};

export const fetchCommitActivity = async (owner: string, repo: string, token?: string): Promise<CommitActivity[]> => {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`, { headers: getHeaders(token) });
  if (response.status === 202) {
    // GitHub is caching the stat, we need to wait a moment and maybe retry in a real app
    // For simplicity, we return empty array or retry once after delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const retry = await fetch(`${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`, { headers: getHeaders(token) });
    if (!retry.ok) throw new Error(retry.statusText);
    return retry.json();
  }
  if (!response.ok) {
    if (response.status === 403) throw new Error('Rate limit exceeded');
    if (response.status === 404) throw new Error('Not found');
    throw new Error(response.statusText);
  }
  return response.json();
};

export const fetchContributors = async (owner: string, repo: string, token?: string): Promise<Contributor[]> => {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/stats/contributors`, { headers: getHeaders(token) });
  if (response.status === 202) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const retry = await fetch(`${BASE_URL}/repos/${owner}/${repo}/stats/contributors`, { headers: getHeaders(token) });
    if (!retry.ok) throw new Error(retry.statusText);
    return retry.json();
  }
  if (!response.ok) {
    if (response.status === 403) throw new Error('Rate limit exceeded');
    if (response.status === 404) throw new Error('Not found');
    throw new Error(response.statusText);
  }
  return response.json();
};

export const fetchLanguages = async (owner: string, repo: string, token?: string): Promise<Record<string, number>> => {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/languages`, { headers: getHeaders(token) });
  if (!response.ok) {
    if (response.status === 403) throw new Error('Rate limit exceeded');
    if (response.status === 404) throw new Error('Not found');
    throw new Error(response.statusText);
  }
  return response.json();
};

// We will fetch recent commits and their details to build a proxy for file hotspots
export const fetchRecentCommits = async (owner: string, repo: string, token?: string, perPage = 30) => {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/commits?per_page=${perPage}`, { headers: getHeaders(token) });
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
};

export const fetchCommitDetails = async (owner: string, repo: string, ref: string, token?: string) => {
  const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/commits/${ref}`, { headers: getHeaders(token) });
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
};
