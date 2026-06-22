import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }
});

export async function get(path, params) {
  const res = await api.get(path, { params });
  return res.data;
}

export async function post(path, data) {
  const res = await api.post(path, data);
  return res.data;
}
