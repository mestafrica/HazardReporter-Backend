import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import HazardReport from "../models/hazardreport";
import User from "../models/user";
import { hazardreportValidator } from "../validators/hazardreport";
import { IHazardReport } from "../interfaces/hazardreport";

const NAMESPACE = "HazardReport";

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
      images:
        (req.files as Express.Multer.File[] | undefined)
          ?.filter((file) => file && (file as any).path)
          ?.map((file) => (file as any).path) || [],
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

    const hazardReport = (await HazardReport.create({
      ...value,
      user,
    })) as IHazardReport & { _id: Types.ObjectId };

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
      "userName phoneNumber email",
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
    if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
      return res
        .status(400)
        .json({ message: "Invalid hazard report ID format" });
    }

    const hazardreport = await HazardReport.findById(hazardReportId).exec();

    if (hazardreport) {
      return res
        .status(200)
        .json({ message: "Hazard Report found", hazardreport });
    } else {
      return res.status(404).json({ message: "Hazard Report not found" });
    }
  } catch (error) {
    console.error("Error fetching hazard report by ID:", error);
    next(error);
  }
};

const updateHazardReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const hazardReportId = req.params.id;

  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title or description are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
      return res
        .status(400)
        .json({ message: "Invalid hazard report ID format" });
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
      return res
        .status(403)
        .json({ message: "You can only edit your own hazard report." });
    }

    const oneHour = 60 * 60 * 1000;
    const timeDifference =
      Date.now() - new Date(hazardReport.createdAt).getTime();

    if (timeDifference > oneHour) {
      return res.status(403).json({
        message:
          "You can only edit a hazard report within 1 hour of posting it.",
      });
    }

    hazardReport.title = title;
    hazardReport.description = description;
    await hazardReport.save();

    return res
      .status(200)
      .json({ message: "Hazard Report updated successfully", hazardReport });
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
    const jwtId = req.user?.id;

    if (!jwtId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID is missing in JWT" });
    }

    if (!mongoose.isValidObjectId(jwtId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const userId = mongoose.Types.ObjectId.createFromHexString(jwtId);
    const hazardReports = await HazardReport.find({ user: userId }).exec();

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
    if (!mongoose.Types.ObjectId.isValid(hazardReportId)) {
      return res
        .status(400)
        .json({ message: "Invalid hazard report ID format" });
    }

    const deletedHazardReport =
      await HazardReport.findByIdAndDelete(hazardReportId).exec();

    if (deletedHazardReport) {
      return res
        .status(200)
        .json({ message: "Hazard Report deleted successfully" });
    } else {
      return res.status(404).json({ message: "Hazard Report not found" });
    }
  } catch (error) {
    console.error("Error deleting hazard report:", error);
    next(error);
  }
};

const getHazardReportStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totalReports = await HazardReport.countDocuments();

    const reportsByHazardType = await HazardReport.aggregate([
      { $group: { _id: "$hazardtype", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const reportsByStatus = await HazardReport.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const reportsByCity = await HazardReport.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const reportsByCountry = await HazardReport.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const reportsByUser = await HazardReport.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
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
          "userDetails.userName": 1,
          "userDetails.email": 1,
        },
      },
    ]);

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

const updateReportStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["open", "in progress", "resolved"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}`,
      });
    }

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

export default {
  createHazardReport,
  updateHazardReport,
  getHazardReportById,
  getAllHazardReports,
  getUserHazardCount,
  deleteHazardReport,
  getHazardReportStats,
  updateReportStatus,
};
