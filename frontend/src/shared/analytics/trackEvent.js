import { apiClient } from '../http/apiClient';

/**
 * Tracks a custom event by sending it to the backend analytics API.
 * @param {string} eventType - The type of event (e.g., 'page_view', 'project_view', 'blog_read', 'resume_download')
 * @param {string} entityId - The ID or slug of the entity being interacted with
 * @param {Object} metadata - Optional additional data for the event
 */
export const trackEvent = async (eventType, entityId, metadata = {}) => {
  try {
    await apiClient.post('/analytics/track', {
      type: eventType,
      slug: entityId,
      metadata,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Fail silently to not disrupt user experience
    console.error('Failed to track analytics event:', error);
  }
};
