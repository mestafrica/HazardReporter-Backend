import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import HazardReport from "../models/hazardreport";
import User from "../models/user";
import { hazardreportValidator } from "../validators/hazardreport";
import { IHazardReport } from "../interfaces/hazardreport";

const NAMESPACE = "HazardReport";

type UploadedFile = {
  filename: string;
  path: string;
};

type RequestWithFiles = Request & {
  files?: unknown;
};

const createHazardReport = async (
  req: RequestWithFiles,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, value } = hazardreportValidator.validate({
      ...req.body,
      images: ((req.files as Express.Multer.File[] | undefined) || []).map(
        (file) => file.path
      ),
    });
  
  if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const userId = req.user?.id;
    

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create hazard report with explicit type
    const hazardReport = (await HazardReport.create({
      ...value,
      user,
    })) as IHazardReport & { _id: Types.ObjectId };
    

    // Add the new hazard report's ID to the user's reports array
    user.reports.push(hazardReport._id);
    await user.save();
   
    return res
      .status(201)
      .json({ message: "Hazard Report created successfully", hazardReport });
  } catch (error) {
    console.error(NAMESPACE, (error as Error).message, error);
    next(error);
  }
};

const getAllHazardReports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hazardReports = await HazardReport.find().populate(
      "user",
      "firstName lastName userName",
    );
    return res.status(200).json({
      message: "All Hazard Reports retrieved successfully",
      hazardReports,
      count: hazardReports.length,
    });
  } catch (error) {
    console.error("Error fetching hazard reports:", error);
    next(error);
  }
};

const getHazardReportById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const hazardReportId = req.params.id;
  try {
    // Validate the ID format (assuming it's an ObjectId)
    if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
      return res
        .status(400)
        .json({ message: "Invalid hazard report ID format" });
    }

    // Fetch the hazard report by ID
    const hazardreport = await HazardReport.findById(hazardReportId).exec();

    if (hazardreport) {
      return res.status(200).json({
        message: "Hazard Report found",
        hazardreport,
      });
    } else {
      return res.status(404).json({
        message: "Hazard Report not found",
      });
    }
  } catch (error) {
    console.error("Error fetching hazard report by ID:", error);
    next(error);
  }
};

const updateHazardReport = async (req: Request, res: Response, next: NextFunction) => {
  const hazardReportId = req.params.id;

  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title or description are required" });
    }

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
      return res.status(400).json({ message: "Invalid hazard report ID format" });
    }

    const hazardReport = await HazardReport.findById(hazardReportId);

    if (!hazardReport) {
      return res.status(404).json({ message: "Hazard Report not found" });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (hazardReport.user.toString() !== userId) {
      return res.status(403).json({ message: "You can only edit your own hazard report." });
    }

    const oneHour = 60 * 60 * 1000;
    const timeDifference = Date.now() - new Date(hazardReport.createdAt).getTime();

    if (timeDifference > oneHour) {
      return res.status(403).json({
        message: "You can only edit a hazard report within 1 hour of posting it."
      });
    }

    hazardReport.title = title;
    hazardReport.description = description;

    await hazardReport.save();

    return res.status(200).json({
      message: "Hazard Report updated successfully",
      hazardReport
    });
  } catch (error) {
    console.error("Error updating hazard report:", error);
    next(error);
  }
};

const getUserHazardCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jwtId = req.user?.id; // Extract user ID from the JWT

    // Check if the user ID exists in the JWT
    if (!jwtId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID is missing in JWT" });
    }
    // Validate that the user ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(jwtId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Convert the user ID to a MongoDB ObjectId
    const userId = mongoose.Types.ObjectId.createFromHexString(jwtId);

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

const deleteHazardReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const hazardReportId = req.params.id;

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
      return res
        .status(400)
        .json({ message: "Invalid hazard report ID format" });
    }

    // Delete the hazard report
    const deletedHazardReport =
      await HazardReport.findByIdAndDelete(hazardReportId).exec();
    
    if (deletedHazardReport) {
      return res.status(200).json({
        message: "Hazard Report deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Hazard Report not found",
      });
    }
  } catch (error) {
    console.error("Error deleting hazard report:", error);
    next(error);
  }
};

// Function for the hazard report statistics endpoint
const getHazardReportStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Total number of reports
    const totalReports = await HazardReport.countDocuments();

    // Reports grouped by hazard type
    const reportsByHazardType = await HazardReport.aggregate([
      {
        $group: {
          _id: "$hazardtype",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // highest first
    ]);

    // Reports grouped by status
    const reportsByStatus = await HazardReport.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Reports grouped by city
    const reportsByCity = await HazardReport.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // highest first
    ]);

    // Reports grouped by country
    const reportsByCountry = await HazardReport.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Reports per user (top reporters)
    const reportsByUser = await HazardReport.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          count: 1,
          "userDetails.firstName": 1,
          "userDetails.lastName": 1,
          "userDetails.userName": 1,
          "userDetails.email": 1,
        },
      },
    ]);

    // Reports created per month (for charts/graphs)
    const reportsByMonth = await HazardReport.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    return res.status(200).json({
      message: "Hazard report statistics retrieved successfully",
      stats: {
        totalReports,
        reportsByHazardType,
        reportsByStatus,
        reportsByCity,
        reportsByCountry,
        reportsByUser,
        reportsByMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching hazard report stats:", error);
    next(error);
  }
};

// Function to update report status
const updateReportStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status value
    const allowedStatuses = ["open", "in progress", "resolved"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`,
      });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid report ID format" });
    }

    const updatedReport = await HazardReport.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).populate("user", "userName phoneNumber email");

    if (!updatedReport) {
      return res.status(404).json({ message: "Hazard report not found" });
    }

    return res.status(200).json({
      message: "Report status updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    next(error);
  }
};

const upvoteHazardReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hazard report ID format" });
    }

    const hazardReport = await HazardReport.findById(id);

    if (!hazardReport) {
      return res.status(404).json({ message: "Not found" });
    }

    // Check if user already upvoted
    const alreadyUpvoted = (hazardReport.upvotedBy || []).some(
      (user) => user.toString() === userId
    );

    if (alreadyUpvoted) {
      return res.status(400).json({
        message: "You have already upvoted this report",
      });
    }

    hazardReport.upvotedBy = hazardReport.upvotedBy || [];
    hazardReport.upvotedBy.push(userId);

    hazardReport.upvotes = (hazardReport.upvotes || 0) + 1;

    await hazardReport.save();

    return res.status(200).json({
      message: "Upvoted successfully",
      hazardReport,
    });
  } catch (error) {
    console.error("Error upvoting hazard report:", error);
    next(error);
  }
};

export default {
  createHazardReport,
  getUserHazardCount,
  deleteHazardReport,
  getAllHazardReports,
  getHazardReportById,
  updateHazardReport,
  getHazardReportStats,
  upvoteHazardReport,
  updateReportStatus,
};

