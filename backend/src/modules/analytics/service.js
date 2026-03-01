import { createEvent, getStats } from "./repository.js";

export function trackEvent(type, slug) {
  return createEvent({ type, slug });
}

export function adminGetStats() {
  return getStats();
}
