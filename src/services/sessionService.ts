import { Session, SessionStatus } from "../models/Session";
import { Teacher } from "../models/Teacher";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { CreateSessionInput } from "../validators/schemas";

export const createSession = async (input: CreateSessionInput) => {
  if (input.endTime <= input.startTime) {
    throw new AppError("endTime must be greater than startTime", 400);
  }

  const teacher = await Teacher.findById(input.teacherId);
  if (!teacher) throw new AppError("Teacher not found", 404);

  return Session.create({
    teacherId: input.teacherId,
    startTime: input.startTime,
    endTime: input.endTime,
  });
};

export const getAvailableSessions = async (dateTimestamp: number) => {
  // Day boundaries in UTC
  const d = new Date(dateTimestamp);
  const dayStart = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

  return Session.aggregate([
    {
      $match: {
        status: SessionStatus.AVAILABLE,
        startTime: { $gte: dayStart, $lt: dayEnd },
      },
    },
    { $sort: { startTime: 1 } },
    {
      $lookup: {
        from: Teacher.collection.name,
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher",
      },
    },
    { $unwind: "$teacher" },
    {
      $project: {
        _id: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        teacher: {
          _id: "$teacher._id",
          fullName: "$teacher.fullName",
          specialization: "$teacher.specialization",
          experience: "$teacher.experience",
        },
      },
    },
  ]);
};

export const bookSession = async (sessionId: string, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const session = await Session.findById(sessionId);
  if (!session) throw new AppError("Session not found", 404);

  // Atomic: check status and update in one operation (prevents double booking)
  const booked = await Session.findOneAndUpdate(
    { _id: sessionId, status: SessionStatus.AVAILABLE },
    { $set: { status: SessionStatus.BOOKED, userId } },
    { new: true }
  );

  if (!booked) {
    throw new AppError("Session is not available for booking", 409);
  }
  return booked;
};

export const completeSession = async (sessionId: string) => {
  const session = await Session.findById(sessionId);
  if (!session) throw new AppError("Session not found", 404);

  const completed = await Session.findOneAndUpdate(
    { _id: sessionId, status: SessionStatus.BOOKED },
    { $set: { status: SessionStatus.COMPLETED, completedAt: new Date() } },
    { new: true }
  );

  if (!completed) {
    throw new AppError("Only BOOKED sessions can be marked as completed", 409);
  }
  return completed;
};