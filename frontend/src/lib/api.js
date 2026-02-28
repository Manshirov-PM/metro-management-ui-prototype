import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Pointing to our Express + Prisma backend
});

export const fetchPipelines = async () => {
    const { data } = await api.get('/pipelines');
    return data;
};

export const fetchNotifications = async () => {
    const { data } = await api.get('/notifications');
    return data;
};

export const updateLimits = async (id, pushLimit, pullLimit) => {
    const { data } = await api.put(`/pipelines/${id}/limits`, { pushLimit, pullLimit });
    return data;
};

export const updatePodResources = async (id, cpuLimit, memLimit) => {
    const { data } = await api.put(`/pods/${id}/resources`, { cpuLimit, memLimit });
    return data;
};

export default api;
