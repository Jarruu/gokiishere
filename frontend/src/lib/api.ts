const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error("VITE_API_URL is not defined. Please check your .env file.");
  }
  return url;
};

const BASE_URL = getBaseUrl();

const cache = new Map<string, Promise<any>>();

export function getProjects(page = 1, limit = 10, search = "", category = "All", sortBy = "Newest") {
  const url = `${BASE_URL}/projects?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&category=${category}&sortBy=${sortBy}`;
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(res => res.json()));
  }
  return cache.get(url)!;
}

export function getProject(id: string) {
  const url = `${BASE_URL}/projects/${id}`;
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then(res => res.json()));
  }
  return cache.get(url)!;
}

export async function createProject(payload: any) {
  const response = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to create project');
  }
  invalidateCache('/projects');
  return response.json();
}

export async function updateProject(id: string, payload: any) {
  const response = await fetch(`${BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update project');
  }
  invalidateCache('/projects');
  invalidateCache(`/projects/${id}`);
  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`${BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
  invalidateCache('/projects');
  invalidateCache(`/projects/${id}`);
  return response.json();
}

export function invalidateCache(path?: string) {
  if (path) {
    cache.delete(`${BASE_URL}${path}`);
  } else {
    cache.clear();
  }
}
