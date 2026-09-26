var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import axios from "axios";
class AddonService {
  constructor() {
    __publicField(this, "configCache", null);
    __publicField(this, "configPromise", null);
  }
  async getConfig() {
    if (this.configCache) {
      return this.configCache;
    }
    if (this.configPromise) {
      return this.configPromise;
    }
    this.configPromise = axios.get("/api/addons/config").then((response) => {
      this.configCache = response.data;
      return response.data;
    }).finally(() => {
      this.configPromise = null;
    });
    return this.configPromise;
  }
  async getAddons() {
    const response = await axios.get("/api/addons/list");
    return response.data.addons;
  }
  clearCache() {
    this.configCache = null;
  }
}
const addonService = new AddonService();
export {
  addonService
};
