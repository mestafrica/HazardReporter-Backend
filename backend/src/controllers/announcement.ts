import { NextFunction, Request, Response } from 'express';
import Announcement from '../models/announcement';

const NAMESPACE = 'AnnouncementController';

export const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, detail, category, status, pinToFeed, location } = req.body;
        
        const files = req.files as Express.Multer.File[] | undefined;
        const attachments = files?.map(file => ({
            url: (file as any).path,
            filename: file.originalname,
            publicId: (file as any).filename,
            format: file.mimetype.split('/')[1]
        })) || [];

        const userId = req.user?.id;

        const announcement = await Announcement.create({
            title,
            detail,
            category,
            status,
            pinToFeed,
            location: location ? JSON.parse(location) : undefined,
            attachments,
            createdBy: userId
        });

        return res.status(201).json({ 
            message: 'Announcement created successfully', 
            announcement 
        });
    } catch (error) {
        console.error(NAMESPACE, (error as Error).message, error);
        next(error);
    }
};

export const getAllAnnouncements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, category, search } = req.query;
        
        let query: any = {};
        
        if (status && status !== 'All Status') {
            query.status = status;
        }
        
        if (category && category !== 'All Categories') {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { detail: { $regex: search, $options: 'i' } }
            ];
        }

        const announcements = await Announcement.find(query)
            .populate('createdBy', 'firstName lastName userName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Announcements retrieved successfully',
            announcements,
            count: announcements.length
        });
    } catch (error) {
        console.error(NAMESPACE, (error as Error).message, error);
        next(error);
    }
};

export const getAnnouncementById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        const announcement = await Announcement.findById(id)
            .populate('createdBy', 'firstName lastName userName');

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        return res.status(200).json({
            message: 'Announcement found',
            announcement
        });
    } catch (error) {
        console.error(NAMESPACE, (error as Error).message, error);
        next(error);
    }
};

export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, detail, category, status, pinToFeed, location, keepAttachments } = req.body;

        const updateData: any = {
            title,
            detail,
            category,
            status,
            pinToFeed,
            location: location ? JSON.parse(location) : undefined
        };

        if (req.files && (req.files as Express.Multer.File[]).length > 0) {
            const newAttachments = (req.files as Express.Multer.File[]).map(file => ({
                url: (file as any).path,
                filename: file.originalname,
                publicId: (file as any).filename,
                format: file.mimetype.split('/')[1]
            }));
            
            if (keepAttachments === 'true') {
                const existingAnnouncement = await Announcement.findById(id);
                updateData.attachments = [
                    ...(existingAnnouncement?.attachments || []),
                    ...newAttachments
                ];
            } else {
                updateData.attachments = newAttachments;
            }
        }

        const announcement = await Announcement.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).populate('createdBy', 'firstName lastName userName');

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        return res.status(200).json({
            message: 'Announcement updated successfully',
            announcement
        });
    } catch (error) {
        console.error(NAMESPACE, (error as Error).message, error);
        next(error);
    }
};

export const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findByIdAndDelete(id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        return res.status(200).json({
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        console.error(NAMESPACE, (error as Error).message, error);
        next(error);
    }
};

export const deleteAnnouncementAttachment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, attachmentId } = req.params;

        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        announcement.attachments = announcement.attachments?.filter(
            att => att._id?.toString() !== attachmentId
        );
        
        await announcement.save();

        return res.status(200).json({
            message: 'Attachment deleted successfully',
            announcement
        });
    } catch (error) {
        console.error(NAMESPACE, (error as Error).message, error);
        next(error);
    }
};
