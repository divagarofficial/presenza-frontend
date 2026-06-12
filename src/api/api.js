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

      // Try silent refresh once; if it fails then redirect to login.
      const doRedirect = () => {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
        } catch {
          // ignore
        }
        const path = window.location.pathname || "/";
        if (path.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/student/login";
        }
      };

      if (error?.config && !error.config.__isRetryRequest) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          error.config.__isRetryRequest = true;
          return api
            .post("/auth/refresh", { refresh_token: refreshToken })
            .then((r) => {
              const newAccess = r.data.access_token;
              const newRefresh = r.data.refresh_token || refreshToken;
              localStorage.setItem("token", newAccess);
              if (newRefresh) localStorage.setItem("refresh_token", newRefresh);
              error.config.headers.Authorization = `Bearer ${newAccess}`;
              return api.request(error.config);
            })
            .catch(() => doRedirect());
        }
      }

      doRedirect();
    }


    return Promise.reject(error);
  }
);

export default api;
