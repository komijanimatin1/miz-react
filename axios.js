import axios from "axios";
import { useAuthStore } from "./src/stores/Authentication";
import { useRouter } from "vue-router";
import router from "./src/router/index.js";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = "https://betaapi.fanapmed.com/Api/";

const authStore = useAuthStore();

const launcherApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

launcherApi.interceptors.request.use(
  (config) => {
    const userToken = authStore.activeAccount.accessToken;
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

launcherApi.interceptors.response.use(
  (response) => {
    // If the request was successful, return the response
    return response;
  },
  async (error, s) => {
    const originalRequest = error.config;
    console.log(error);

    // If the error status is 401 and it's not already refreshing the token
    if (error.response?.status === 401 && !isRefreshing) {
      try {
        isRefreshing = true;
        const newToken = await refreshToken();
        isRefreshing = false;
        originalRequest.headers.Authorization = "Bearer " + newToken;

        console.log("originalRequest is: ", originalRequest);

        return launcherApi(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        processQueue(null, localStorage.getItem("accessToken"));
      }
    }

    // If the error status is 401 and the token refresh is in progress
    if (error.response?.status === 401 && isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return launcherApi(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // For other errors, return the error
    return Promise.reject(error);
  }
);

// -----------------------------------------------
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    // Other default headers can be added here
  },
});

export const refreshToken = async () => {
  // Implement your logic to refresh the token and update the axios instance
  // with the new token
  debugger;
  const payload = {
    refreshToken: authStore.activeAccount.refreshToken,
    accessToken: authStore.activeAccount.accessToken,
  };

  try {
    let res = await axios.post(
      `${baseURL}Authentication/RefreshToken`,
      payload
    );

    debugger;
    // Set your token info in localstorage or redux or etc...
    // localStorage.set("accessToken", res?.data.data.accessToken);
    authStore.activeAccount.accessToken = res?.data.data.accessToken;
    authStore.activeAccount.refreshToken = res?.data.data.refreshToken;
    authStore.accounts.forEach((account) => {
      if (account.phoneNumber === authStore.activeAccount.phoneNumber) {
        account.accessToken = res?.data.data.accessToken;
        account.refreshToken = res?.data.data.refreshToken;
      }
    });
    // setTokenInfo(res?.data);

    launcherApi.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.data.accessToken}`;
    return res.data.data.accessToken;
  } catch (error) {
    authStore.logout();
    // window.location.href = "/";
    router.replace({ name: "login" });
    router.go(0);
  }
};

api.interceptors.request.use(
  (config) => {
    const userToken = authStore.activeAccount.accessToken;
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // If the request was successful, return the response
    return response;
  },
  async (error, s) => {
    const originalRequest = error.config;
    console.log("inside of interceptor response");
    console.log(error);

    // If the error status is 401 and it's not already refreshing the token
    if (error.response?.status === 401 && !isRefreshing) {
      try {
        isRefreshing = true;
        const newToken = await refreshToken();
        isRefreshing = false;
        originalRequest.headers.Authorization = "Bearer " + newToken;

        console.log("originalRequest is: ", originalRequest);

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        processQueue(null, localStorage.getItem("accessToken"));
      }
    }

    // If the error status is 401 and the token refresh is in progress
    if (error.response?.status === 401 && isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // For other errors, return the error
    return Promise.reject(error);
  }
);

const loginApi = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    // Other default headers can be added here
  },
});
loginApi.interceptors.request.use((config) => {
  return config;
});

export { api, loginApi, launcherApi };
