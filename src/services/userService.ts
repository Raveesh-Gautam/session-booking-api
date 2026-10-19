import { Types } from "mongoose";
import { User } from "../models/User";
import { Session, SessionStatus } from "../models/Session";
import { Teacher } from "../models/Teacher";
import { AppError } from "../utils/AppError";
import { CreateUserInput } from "../validators/schemas";

export const createUser = async (input: CreateUserInput) => {
  return User.create(input);
};

export const getUserSessions = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  // aggregate() does NOT auto-cast strings, so convert to ObjectId manually
  const result = await Session.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $lookup: {
        from: Teacher.collection.name,
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher",
      },
    },
    { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        completedAt: 1,
        teacher: {
          _id: "$teacher._id",
          fullName: "$teacher.fullName",
          specialization: "$teacher.specialization",
          experience: "$teacher.experience",
        },
      },
    },
    {
      $facet: {
        upcomingSessions: [
          { $match: { status: SessionStatus.BOOKED } },
          { $sort: { startTime: 1 } },
        ],
        completedSessions: [
          { $match: { status: SessionStatus.COMPLETED } },
          { $sort: { completedAt: -1 } },
        ],
      },
    },
  ]);

  return result[0];
};