import { api } from "./api.js";

export function trackEvent(type, slug) {
  return api.post("/analytics/track", { type, slug }).catch(() => {});
}
