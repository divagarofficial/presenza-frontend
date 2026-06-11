import axios from "axios";

function resolveBaseURL() {
  const raw = import.meta.env.VITE_API_URL;
  if (raw != null && String(raw).trim() !== "") {
    return String(raw).replace(/\/$/, "");
  }
  // Dev: same origin + Vite proxy → backend (see vite.config.js proxy).
  const devProxyTarget = import.meta.env.VITE_DEV_PROXY_TARGET;
  if (
    import.meta.env.DEV &&
    devProxyTarget != null &&
    String(devProxyTarget).trim() !== ""
  ) {
    return String(devProxyTarget).replace(/\/$/, "");
  }

  if (import.meta.env.DEV) {
    return "";
  }
  return "";
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

/* 🔐 ATTACH JWT TO EVERY REQUEST */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Global response handler: handle auth errors (expired/invalid token) */
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    // Avoid nuking token due to transient/route mismatch 401s on refresh.
    // If server says token is invalid/expired, frontend redirects anyway.
    if (status === 401) {

      // Clear token and redirect to an appropriate login page
      try {
        localStorage.removeItem("token");
      } catch {
        // ignore
      }

      const path = window.location.pathname || "/";
      if (path.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        // student and CR pages use student login
        window.location.href = "/student/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
