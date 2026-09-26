var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import axios from "axios";
const API_URL = window.DASHBOARD_CONFIG?.API_URL;
class AuthService {
  constructor() {
    __publicField(this, "session", {
      user: null,
      accessToken: null
    });
    __publicField(this, "sessionPromise", null);
    __publicField(this, "oauthConfig", null);
    __publicField(this, "authPages", ["/auth/callback", "/auth/signin", "/auth/access-denied"]);
    this.sessionPromise = this.validateSession();
  }
  async validateSession() {
    try {
      if (this.authPages.some((page) => window.location.pathname === page)) {
        return;
      }
      const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
      if (response.data?.user) {
        this.session.user = response.data.user;
      } else {
        const currentPath = window.location.pathname;
        if (!this.authPages.includes(currentPath)) {
          window.location.href = `/auth/signin${currentPath !== "/" ? `?returnUrl=${currentPath}` : ""}`;
        }
      }
    } catch (error) {
      this.session = { user: null, accessToken: null };
      const currentPath = window.location.pathname;
      if (!this.authPages.includes(currentPath)) {
        window.location.href = `/auth/signin${currentPath !== "/" ? `?returnUrl=${currentPath}` : ""}`;
      }
    } finally {
      this.sessionPromise = null;
    }
  }
  async isAuthenticated() {
    if (this.sessionPromise) {
      await this.sessionPromise;
    }
    return !!this.session.user;
  }
  async getUser() {
    if (this.sessionPromise) {
      await this.sessionPromise;
    }
    return this.session.user;
  }
  async getOAuthConfig() {
    if (this.oauthConfig) return this.oauthConfig;
    try {
      const response = await axios.get(`${API_URL}/auth/config`);
      this.oauthConfig = response.data;
      return this.oauthConfig;
    } catch (error) {
      console.error("[Auth] Failed to load OAuth config:", error);
      return null;
    }
  }
  async login(returnUrl) {
    if (returnUrl) {
      sessionStorage.setItem("returnUrl", returnUrl);
    }
    const config = await this.getOAuthConfig();
    const params = new URLSearchParams({
      client_id: config?.clientId || "",
      redirect_uri: config?.redirectUri || "",
      response_type: "code",
      scope: "identify email guilds guilds.members.read"
    });
    const url = `https://discord.com/api/oauth2/authorize?${params}`;
    window.location.href = url;
  }
  async handleCallback(code) {
    try {
      const response = await axios.get(`${API_URL}/auth/callback?code=${code}`, {
        withCredentials: true
      });
      const { user, token } = response.data;
      if (!user) {
        throw new Error("Invalid response from server");
      }
      this.session = { user, accessToken: token };
      const returnUrl = sessionStorage.getItem("returnUrl");
      sessionStorage.removeItem("returnUrl");
      return { returnUrl: returnUrl || "/" };
    } catch (error) {
      this.session = { user: null, accessToken: null };
      sessionStorage.removeItem("returnUrl");
      if (error.response?.status === 403) {
        return { error: "access_denied" };
      }
      return { error: "auth_error" };
    }
  }
  async logout() {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } finally {
      this.session = { user: null, accessToken: null };
      window.location.href = "/auth/signin";
    }
  }
  async getSession() {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true
      });
      const { user } = response.data;
      if (!user) return null;
      return { user, accessToken: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        window.location.href = `/auth/signin${window.location.pathname !== "/" ? `?returnUrl=${window.location.pathname}` : ""}`;
        return null;
      }
      console.error("[Auth] Error getting session:", error);
      return null;
    }
  }
}
const auth = new AuthService();
export {
  auth
};
