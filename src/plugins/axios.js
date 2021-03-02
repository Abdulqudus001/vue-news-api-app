import axios from 'axios';

const http = axios.create();

http.interceptors.request.use((config) => {
  const apiKey = process.env.VUE_APP_NEWS_API;
  // eslint-disable-next-line
  config.headers.Authorization = apiKey;
  return config;
});

export default http;
