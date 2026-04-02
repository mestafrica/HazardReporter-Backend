import { NextFunction, Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import HazardReport from '../models/hazardreport';
import User from '../models/user';
import { hazardreportValidator } from '../validators/hazardreport';
import { IHazardReport } from '../interfaces/hazardreport';


const NAMESPACE = 'HazardReport';

const createHazardReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
console.log('req.files:', req.files);
        console.log('req.body before processing:', req.body)
        
        const { error, value } = hazardreportValidator.validate({
            ...req.body,
           images: (req.files as Express.Multer.File[] | undefined)
  ?.filter(file => file && (file as any).filename && (file as any).path)
  ?.map(file => (file as any).filename) || []
        });

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userId = res.locals.jwt?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create hazard report with explicit type
        const hazardReport = await HazardReport.create({...value, user}) as IHazardReport & { _id: Types.ObjectId };

        // Add the new hazard report's ID to the user's reports array
        user.reports.push(hazardReport._id);
        await user.save();

        return res.status(201).json({ message: 'Hazard Report created successfully', hazardReport });
    } catch (error) {
        console.error(NAMESPACE, (error as Error).message, error);
        next(error);
    }
};


const getAllHazardReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hazardReports = await HazardReport.find()
        .populate('user', 'firstName lastName userName');;

        return res.status(200).json({
            message: 'All Hazard Reports retrieved successfully',
            hazardReports,
            count: hazardReports.length
        });
    } catch (error) {
        console.error('Error fetching hazard reports:', error);
        next(error);
    }
};


const getHazardReportById = async (req: Request, res: Response, next: NextFunction) => {
    const hazardReportId = req.params.id;

    try {
        // Validate the ID format (assuming it's an ObjectId)
        if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
            return res.status(400).json({ message: 'Invalid hazard report ID format' });
        }

        // Fetch the hazard report by ID
        const hazardreport = await HazardReport.findById(hazardReportId).exec();

        if (hazardreport) {
            return res.status(200).json({
                message: 'Hazard Report found',
                hazardreport
            });
        } else {
            return res.status(404).json({
                message: 'Hazard Report not found'
            });
        }
    } catch (error) {
        console.error('Error fetching hazard report by ID:', error);
        next(error);
    }
};

const updateHazardReport = async (req: Request, res: Response, next: NextFunction) => {
    const hazardReportId = req.params.id;

    try {
        // Validate the data to update a hazard report
        const { error, value } = hazardreportValidator.validate(req.body);
        if (error) {
            console.error('Validation Error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
            return res.status(400).json({ message: 'Invalid hazard report ID format' });
        }

        // Update the hazard report
        const updatedHazardReport = await HazardReport.findByIdAndUpdate(hazardReportId, value, { new: true }).exec();

        if (updatedHazardReport) {
            return res.status(200).json({
                message: 'Hazard Report updated successfully',
                hazardReport: updatedHazardReport
            });
        } else {
            return res.status(404).json({
                message: 'Hazard Report not found'
            });
        }
    } catch (error) {
        console.error('Error updating hazard report:', error);
        next(error);
    }
};



const getUserHazardCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtId = res.locals.jwt?.id; // Extract user ID from the JWT

        // Check if the user ID exists in the JWT
        if (!jwtId) {
            return res.status(401).json({ message: "Unauthorized: User ID is missing in JWT" });
        }

        // Validate that the user ID is a valid MongoDB ObjectId
        if (!mongoose.isValidObjectId(jwtId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        // Convert the user ID to a MongoDB ObjectId
        const userId = new mongoose.Types.ObjectId(jwtId);

        // Fetch the hazard reports associated with the user
        const hazardReports = await HazardReport.find({ user: userId }).exec();
        console.log("Hazard Reports Retrieved:", hazardReports);

        return res.status(200).json({
            message: "User Hazard Reports retrieved successfully",
            hazardReports,
            count: hazardReports.length,
        });
    } catch (error) {
        console.error("Error fetching user hazard reports:", error);
        next(error);
    }
};


const deleteHazardReport = async (req: Request, res: Response, next: NextFunction) => {
    const hazardReportId = req.params.id;

    try {
        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
            return res.status(400).json({ message: 'Invalid hazard report ID format' });
        }

        // Delete the hazard report
        const deletedHazardReport = await HazardReport.findByIdAndDelete(hazardReportId).exec();

        if (deletedHazardReport) {
            return res.status(200).json({
                message: 'Hazard Report deleted successfully'
            });
        } else {
            return res.status(404).json({
                message: 'Hazard Report not found'
            });
        }
    } catch (error) {
        console.error('Error deleting hazard report:', error);
        next(error);
    }
};

export default { createHazardReport, updateHazardReport, getHazardReportById, getAllHazardReports, getUserHazardCount, deleteHazardReport };
