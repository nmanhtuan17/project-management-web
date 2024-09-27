import { appConfig } from "@/configs/app.config";
import axios, { AxiosRequestConfig } from "axios";

class ApiService {
  axiosInstance = axios.create({
    baseURL: appConfig.apiBase,
  });

  auth = {
    accessToken: '',
    refreshToken: '',
  }

  constructor() {
  }

  async post(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.callApi('POST', endpoint, data, config);
  }

  async get(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.callApi('GET', endpoint, data, config);
  }

  async put(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.callApi('PUT', endpoint, data, config);
  }
  async patch(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.callApi('PATCH', endpoint, data, config);
  }
  async delete(endpoint: string, data: any, config: AxiosRequestConfig = {}) {
    return this.callApi('DELETE', endpoint, data, config);
  }

  async callApi(method: string, endpoint: string, data: any = {}, config?: AxiosRequestConfig, ignoreAuth = false) {
    if (!ignoreAuth) await this.refreshTokenCheck();
    try {
      const r = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        headers: {
          Authorization: this.auth.accessToken ? `Bearer ${this.auth.accessToken}` : undefined,
        },
        ...config,
      });
      return r.data;
    } catch (e) {
      if (e.response) {
        if (e.response.data) throw e.response.data;
        throw e.response;
      } else {
        throw e;
      }
    }
  }

  async refreshTokenCheck() {
    
  }

}

export default new ApiService()