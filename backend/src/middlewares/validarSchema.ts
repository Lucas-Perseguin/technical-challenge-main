import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";

export default function validarSchema(schema: ObjectSchema, type: "body" | "query") {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req[type]);
		if (error) {
			res.status(400).send(error.message);
			return;
		}
		next();
	};
}
