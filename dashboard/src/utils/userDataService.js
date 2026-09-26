var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const _UserDataService = class _UserDataService {
  constructor() {
    __publicField(this, "userCache");
    __publicField(this, "CACHE_DURATION", 30 * 60 * 1e3);
    __publicField(this, "cleanupInterval", null);
    __publicField(this, "pendingFetches", /* @__PURE__ */ new Map());
    this.userCache = /* @__PURE__ */ new Map();
    this.startCleanupInterval();
    try {
      const cached = sessionStorage.getItem("userDataCache");
      if (cached) {
        const parsedCache = JSON.parse(cached);
        Object.entries(parsedCache).forEach(([key, value]) => {
          this.userCache.set(key, value);
        });
      }
    } catch (error) {
    }
  }
  saveToSessionStorage() {
    try {
      const cacheObject = Object.fromEntries(this.userCache.entries());
      sessionStorage.setItem("userDataCache", JSON.stringify(cacheObject));
    } catch (error) {
    }
  }
  getDefaultUserData(userId) {
    return {
      avatar: this.getDefaultAvatar("User"),
      username: "Loading...",
      displayName: "Loading...",
      timestamp: Date.now()
    };
  }
  async getUserData(userId) {
    try {
      const cached = this.userCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached;
      }
      const defaultData = this.getDefaultUserData(userId);
      this.fetchAndUpdateUser(userId);
      return defaultData;
    } catch (error) {
      return this.getDefaultUserData(userId);
    }
  }
  async fetchAndUpdateUser(userId) {
    try {
      if (this.pendingFetches.has(userId)) {
        return;
      }
      const fetchPromise = this.fetchUserData(userId);
      this.pendingFetches.set(userId, fetchPromise);
      const userData = await fetchPromise;
      this.userCache.set(userId, userData);
      this.saveToSessionStorage();
      this.pendingFetches.delete(userId);
      window.dispatchEvent(new CustomEvent("userDataUpdated", {
        detail: { userId, userData }
      }));
    } catch (error) {
      this.pendingFetches.delete(userId);
    }
  }
  static getInstance() {
    if (!_UserDataService.instance) {
      _UserDataService.instance = new _UserDataService();
    }
    return _UserDataService.instance;
  }
  startCleanupInterval() {
    this.cleanupInterval = window.setInterval(() => {
      const now = Date.now();
      for (const [key, value] of Array.from(this.userCache.entries())) {
        if (now - value.timestamp > this.CACHE_DURATION) {
          this.userCache.delete(key);
        }
      }
    }, this.CACHE_DURATION);
  }
  async prefetchUsers(userIds) {
    const uniqueIds = Array.from(new Set(userIds));
    const now = Date.now();
    const idsToFetch = uniqueIds.filter((id) => {
      const cached = this.userCache.get(id);
      return !cached || now - cached.timestamp > this.CACHE_DURATION;
    });
    await Promise.all(idsToFetch.map((id) => this.getUserData(id)));
  }
  async fetchUserData(userId) {
    try {
      const response = await fetch(`/api/tickets/user/${userId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status === 404) {
        return this.getDefaultUserData(userId);
      }
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      let avatarUrl;
      if (userData.avatar && userData.avatar.startsWith("https://")) {
        avatarUrl = userData.avatar;
      } else if (userData.avatar) {
        avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.webp?size=128`;
      } else {
        avatarUrl = this.getDefaultAvatar(userData.username);
      }
      const cachedData = {
        avatar: avatarUrl,
        username: userData.username,
        displayName: userData.global_name || userData.username,
        timestamp: Date.now()
      };
      this.userCache.set(userId, cachedData);
      return cachedData;
    } catch (error) {
      return this.getDefaultUserData(userId);
    }
  }
  getDefaultAvatar(username) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=7289DA&color=fff&size=128`;
  }
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.userCache.clear();
    this.pendingFetches.clear();
  }
  async getCurrentUser() {
    try {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return {
        id: data.id,
        displayName: data.displayName || data.username,
        avatar: data.avatar || this.getDefaultAvatar(data.username)
      };
    } catch (error) {
      return null;
    }
  }
};
__publicField(_UserDataService, "instance");
let UserDataService = _UserDataService;
const userDataService = UserDataService.getInstance();
export {
  userDataService
};
