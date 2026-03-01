import { apiClient } from '../../../shared/http/apiClient';

export const contactRepository = {
  async sendMessage(messageData: any) {
    const response = await apiClient.post('/contacts', messageData);
    return response.data;
  },

  async getAll() {
    const response = await apiClient.get('/contacts');
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await apiClient.patch(`/contacts/${id}/read`);
    return response.data;
  }
};
