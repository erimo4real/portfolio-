export const config = {
  apiBase: import.meta?.env?.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') + '/api' : "/api"
};
