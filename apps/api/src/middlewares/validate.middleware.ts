import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidationTarget = "body" | "query" | "params";

export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = "body"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[target];
      const validated = await schema.parseAsync(data);
      req[target] = validated;
      next();
    } catch (error) {
      next(error); // Will be caught by error middleware
    }
  };
};
