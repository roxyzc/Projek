import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../library/logging.library';

export const validateSchema = (schema: ObjectSchema) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            Logger.error(error);
            next(error);
        }
    };
};

export const schemas = {
    Auth: {
        register: Joi.object({
            username: Joi.string().min(5).max(24).label('Username').required().messages({
                'string.base': `{{#label}} should be a type of 'text'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'any.required': `{{#label}} is a required field`
            }),
            email: Joi.string().email().label('Email').required().messages({
                'string.email': `'{{#label}}' in Email must be a valid {{#label}}`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            }),
            password: Joi.string().min(11).max(30).label('Password').required().messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'any.required': `{{#label}} is a required field`
            }),
            kelas: Joi.string().label('Kelas').required().messages({
                'string.base': `{{#label}} should be a type of 'String'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            }),
            confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({
                'any.only': '{{#label}} does not match'
            })
        }),
        login: Joi.object({
            email: Joi.string().email().label('Email').required().messages({
                'string.email': `'{email}' in Email must be a valid {{#label}}`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            }),
            password: Joi.string().label('Password').required().messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            })
        }),
        update: Joi.object({
            username: Joi.string().min(5).max(24).label('Username').required().messages({
                'string.base': `{{#label}} should be a type of 'text'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'any.required': `{{#label}} is a required field`
            }),
            password: Joi.string().min(11).max(30).label('Password').required().messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'any.required': `{{#label}} is a required field`
            }),
            kelas: Joi.string().label('Kelas').required().messages({
                'string.base': `{{#label}} should be a type of 'String'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            })
        })
    }
};
