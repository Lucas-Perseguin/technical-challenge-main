import type Joi from "joi";
import { validateCNH, validateCPF } from "validations-br";

export const validarCPF = (value: string, helpers: Joi.CustomHelpers<string>) => {
	if (validateCPF(value)) return value;
	return helpers.message({ custom: "CPF inválido" });
};

export const validarCNH = (value: string, helpers: Joi.CustomHelpers<string>) => {
	if (validateCNH(value)) return value;
	return helpers.message({ custom: "CNH inválida" });
};
