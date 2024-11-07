import { appConfig } from "@/configs/app.config";
import { setAuth } from "@/redux/slices/auth.slice";
import { store } from "@/redux/store";
import axios, { AxiosRequestConfig } from "axios";

class ApiService {
  axiosInstance = axios.create({
    baseURL: appConfig.apiBase,
  });

  auth = {
    accessToken: '',
    refreshToken: '',
  }

  async setCredentials(tokens: { accessToken: string, refreshToken: string }) {
    this.auth = tokens;
    return this.refreshTokenCheck()
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
    if (this.auth.accessToken) {
      let tokenData = JSON.parse(atob(this.auth.accessToken.split('.')[1]));
      if (tokenData.exp <= ~~(new Date().getTime() / 1000)) {
        // refresh
        const { data: tokenResponse } = await this.callApi('POST', '/auth/jwt/refresh', {
          refresh_token: this.auth.accessToken,
        }, {}, true);
        store.dispatch(setAuth({
          tokens: {
            ...tokenResponse,
          }
        }));
        this.setCredentials({
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
        });
      }
    }
  }
}

export default new ApiService()