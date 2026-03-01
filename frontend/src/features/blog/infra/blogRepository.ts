import { apiClient } from '../../../shared/http/apiClient';

export const blogRepository = {
  async getAll() {
    const response = await apiClient.get('/blogs');
    return response.data;
  },

  async getBySlug(slug: string) {
    const response = await apiClient.get(`/blogs/${slug}`);
    return response.data;
  },

  async create(blogData: any) {
    const response = await apiClient.post('/blogs', blogData);
    return response.data;
  },

  async update(id: string, blogData: any) {
    const response = await apiClient.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  },

  async togglePublish(id: string) {
    const response = await apiClient.patch(`/blogs/${id}/publish`);
    return response.data;
  }
};
