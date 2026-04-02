import { apiClient } from './config';
import { Announcement, LocationData } from '../context/DashboardContext';

interface CreateAnnouncementData {
    title: string;
    detail: string;
    category: 'Alert' | 'Info' | 'Update';
    status: 'Pinned' | 'Active' | 'Archived';
    pinToFeed: boolean;
    location?: LocationData;
}

interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {
    keepAttachments?: boolean;
}

export const announcementApi = {
    createAnnouncement: async (
        data: CreateAnnouncementData,
        attachments: File[]
    ): Promise<Announcement> => {
        const formData = new FormData();
        
        formData.append('title', data.title);
        formData.append('detail', data.detail);
        formData.append('category', data.category);
        formData.append('status', data.status);
        formData.append('pinToFeed', String(data.pinToFeed));
        
        if (data.location) {
            formData.append('location', JSON.stringify(data.location));
        }
        
        attachments.forEach(file => {
            formData.append('attachments', file);
        });

        const response = await apiClient.post('/announcement/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data.announcement;
    },

    getAllAnnouncements: async (params?: {
        status?: string;
        category?: string;
        search?: string;
    }): Promise<Announcement[]> => {
        const response = await apiClient.get('/announcement/getall', { params });
        return response.data.announcements;
    },

    getAnnouncementById: async (id: string): Promise<Announcement> => {
        const response = await apiClient.get(`/announcement/getid/${id}`);
        return response.data.announcement;
    },

    updateAnnouncement: async (
        id: string,
        data: UpdateAnnouncementData,
        newAttachments?: File[]
    ): Promise<Announcement> => {
        const formData = new FormData();
        
        if (data.title) formData.append('title', data.title);
        if (data.detail) formData.append('detail', data.detail);
        if (data.category) formData.append('category', data.category);
        if (data.status) formData.append('status', data.status);
        if (data.pinToFeed !== undefined) formData.append('pinToFeed', String(data.pinToFeed));
        if (data.keepAttachments) formData.append('keepAttachments', String(data.keepAttachments));
        if (data.location) formData.append('location', JSON.stringify(data.location));
        
        if (newAttachments) {
            newAttachments.forEach(file => {
                formData.append('attachments', file);
            });
        }

        const response = await apiClient.patch(`/announcement/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data.announcement;
    },

    deleteAnnouncement: async (id: string): Promise<void> => {
        await apiClient.delete(`/announcement/delete/${id}`);
    },

    deleteAttachment: async (id: string, attachmentId: string): Promise<Announcement> => {
        const response = await apiClient.delete(`/announcement/attachment/${id}/${attachmentId}`);
        return response.data.announcement;
    }
};

export default announcementApi;
