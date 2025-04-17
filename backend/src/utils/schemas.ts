import type Joi from "joi";
import { validateCPF } from "validations-br";

export const validarCPF = (value: string, helpers: Joi.CustomHelpers<string>) => {
	if (validateCPF(value)) return value;
	return helpers.message({ custom: "CPF inválido" });
};
