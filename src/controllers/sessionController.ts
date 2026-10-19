import { Request, Response } from "express";
import * as sessionService from "../services/sessionService";
import {
  availableQuerySchema,
  bookSessionSchema,
  createSessionSchema,
  idParamSchema,
} from "../validators/schemas";

export const createSession = async (req: Request, res: Response) => {
  const body = createSessionSchema.parse(req.body);
  const session = await sessionService.createSession(body);
  res.status(201).json({ success: true, data: session });
};

export const getAvailableSessions = async (req: Request, res: Response) => {
  const { dateTimestamp } = availableQuerySchema.parse(req.query);
  const sessions = await sessionService.getAvailableSessions(dateTimestamp);
  res.status(200).json({ success: true, count: sessions.length, data: sessions });
};

export const bookSession = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const { userId } = bookSessionSchema.parse(req.body);
  const session = await sessionService.bookSession(id, userId);
  res.status(200).json({ success: true, data: session });
};

export const completeSession = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const session = await sessionService.completeSession(id);
  res.status(200).json({ success: true, data: session });
};