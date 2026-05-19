const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error(
      "VITE_API_URL is not defined. Please check your .env file.",
    );
  }
  return url;
};

export const BASE_URL = getBaseUrl();
const API_ORIGIN = new URL(BASE_URL).origin;

const cache = new Map<string, Promise<any>>();

const emptyProjectsResponse = {
  data: [],
  meta: {
    total: 0,
    page: 1,
    limit: 0,
    totalPages: 0,
    hasNextPage: false,
  },
};

const fetchJson = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(
      data?.message || `Request failed with status ${response.status}`,
    );
  }

  return response.json();
};

export async function login(payload: any) {
  return fetchJson(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function resolveAssetUrl(path: string) {
  if (
    !path ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getProjects(
  page = 1,
  limit = 10,
  search = "",
  category = "All",
  sortBy = "Newest",
) {
  const url = `${BASE_URL}/projects?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&category=${category}&sortBy=${sortBy}`;
  if (!cache.has(url)) {
    cache.set(
      url,
      fetchJson(url).catch((error) => {
        cache.delete(url);
        console.error(`Backend API is unavailable at ${BASE_URL}.`, error);
        return {
          ...emptyProjectsResponse,
          meta: {
            ...emptyProjectsResponse.meta,
            page,
            limit,
          },
        };
      }),
    );
  }
  return cache.get(url)!;
}

export function getProject(id: string) {
  const url = `${BASE_URL}/projects/${id}`;
  if (!cache.has(url)) {
    cache.set(
      url,
      fetchJson(url).catch((error) => {
        cache.delete(url);
        console.error(`Backend API is unavailable at ${BASE_URL}.`, error);
        return null;
      }),
    );
  }
  return cache.get(url)!;
}

export async function createProject(payload: any) {
  const isFormData = payload instanceof FormData;
  const response = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to create project");
  }
  invalidateCache("/projects");
  return response.json();
}

export async function updateProject(id: string, payload: any) {
  const isFormData = payload instanceof FormData;
  const response = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to update project");
  }
  invalidateCache("/projects");
  invalidateCache(`/projects/${id}`);
  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
  invalidateCache("/projects");
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
