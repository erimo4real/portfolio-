import axios from "axios";
import { config } from "../config.js";

export const api = axios.create({
  baseURL: config.apiBase,
  headers: { "Content-Type": "application/json" }
});

export async function get(path, params) {
  const res = await api.get(path, { params });
  return res.data;
}

export async function post(path, data) {
  const res = await api.post(path, data);
  return res.data;
}
