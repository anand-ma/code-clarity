/**
 * Converts a GitHub URL to its raw content URL format
 * @param url The GitHub URL to convert
 * @returns The raw GitHub content URL
 */
export const convertGithubUrlToRaw = (url: string): string => {
  // Clean the URL first
  url = url.trim();
  
  // If it's already a raw URL, clean it and return
  if (url.includes('raw.githubusercontent.com')) {
    return url.split('?')[0];
  }
  
  // Handle both blob and tree URLs
  const githubPattern = /github\.com\/([^/]+)\/([^/]+)\/(?:blob|tree)\/([^/]+)\/(.+)/;
  const match = url.match(githubPattern);
  
  if (match) {
    const [, user, repo, branch, path] = match;
    return `https://raw.githubusercontent.com/${user}/${repo}/refs/heads/${branch}/${path}`;
  }
  
  throw new Error('Invalid GitHub URL format');
}; 