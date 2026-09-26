import axios from "axios";
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 6e4,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});
api.interceptors.request.use((config) => {
  const token = getCookie("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Firefox")) {
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["Cache-Control"] = "no-cache";
  }
  return config;
}, (error) => {
  console.error("[CSRF] Request interceptor error:", error);
  return Promise.reject(error);
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.error("[NETWORK] Request timeout - retrying...", {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
      if (navigator.userAgent.includes("Firefox")) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        try {
          return await api.request(error.config);
        } catch (retryError) {
          console.error("[NETWORK] Retry failed:", retryError);
          return Promise.reject(retryError);
        }
      }
    }
    if (error.response?.status === 403 && error.response?.data?.message === "Invalid CSRF token") {
      console.error("[SECURITY] Access forbidden:", error.response.data);
      window.location.reload();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
var stdin_default = api;
export {
  stdin_default as default
};
