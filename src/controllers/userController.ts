import { Request, Response } from "express";
import * as userService from "../services/userService";
import { createUserSchema, idParamSchema } from "../validators/schemas";

export const createUser = async (req: Request, res: Response) => {
  const body = createUserSchema.parse(req.body);
  const user = await userService.createUser(body);
  res.status(201).json({ success: true, data: user });
};

export const getUserSessions = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params);
  const data = await userService.getUserSessions(id);
  res.status(200).json({ success: true, data });
};