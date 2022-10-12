"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.validateSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const logging_library_1 = require("../library/logging.library");
const validateSchema = (schema) => {
    return (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            logging_library_1.Logger.error(error);
            next(error);
        }
    });
};
exports.validateSchema = validateSchema;
exports.schemas = {
    Auth: {
        register: joi_1.default.object({
            username: joi_1.default.string().min(5).max(24).label('Username').required().messages({
                'string.base': `{{#label}} should be a type of 'text'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'any.required': `{{#label}} is a required field`
            }),
            email: joi_1.default.string().email().label('Email').required().messages({
                'string.email': `'{{#label}}' in Email must be a valid {{#label}}`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            }),
            password: joi_1.default.string().min(11).max(30).label('Password').required().messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'any.required': `{{#label}} is a required field`
            }),
            kelas: joi_1.default.string()
                .trim()
                .label('Kelas')
                .regex(/[^A-Z 1-9][^/s][^.]/, { invert: true })
                .valid('TI.21.A.3', 'TI.21.A.2', 'TI.21.A.1')
                .required()
                .messages({
                'string.base': `{{#label}} should be a type of 'String'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`,
                'any.only': `{{#label}} {#value} is missing`
            }),
            confirmPassword: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('Confirm password').messages({
                'any.only': '{{#label}} does not match'
            })
        }),
        login: joi_1.default.object({
            email: joi_1.default.string().email().label('Email').required().messages({
                'string.email': `'{email}' in Email must be a valid {{#label}}`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            }),
            password: joi_1.default.string().label('Password').required().messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            })
        })
    },
    User: {
        update: joi_1.default.object({
            username: joi_1.default.string().min(5).max(24).label('Username').messages({
                'string.base': `{{#label}} should be a type of 'text'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`
            }),
            password: joi_1.default.string().min(11).max(30).label('Password').messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`
            }),
            kelas: joi_1.default.string()
                .trim()
                .regex(/[^A-Z 1-9][^/s][^.]/, { invert: true })
                .valid('TI.21.A.3', 'TI.21.A.2', 'TI.21.A.1')
                .min(2)
                .max(10)
                .label('Kelas')
                .messages({
                'string.base': `{{#label}} should be a type of 'String'`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.only': `{{#label}} {#value} is missing`
            })
        }),
        violation: joi_1.default.object({
            username: joi_1.default.string().min(5).max(24).label('Username').messages({
                'string.base': `{{#label}} should be a type of 'text'`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`
            }),
            kelas: joi_1.default.string()
                .trim()
                .regex(/[^A-Z 1-9][^/s][^.]/, { invert: true })
                .valid('TI.21.A.3', 'TI.21.A.2', 'TI.21.A.1')
                .min(2)
                .max(10)
                .label('Kelas')
                .messages({
                'string.base': `{{#label}} should be a type of 'String'`,
                'string.min': `{{#label}} should have a minimum length of {#limit}`,
                'string.max': `{{#label}} must be less than or equal to {#limit}`,
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.only': `{{#label}} {#value} is missing`
            }),
            aspek: joi_1.default.string().required().label('aspek').messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            }),
            deskripsi: joi_1.default.string().required().label('deskripsi').messages({
                'string.empty': `{{#label}} cannot be an empty field`,
                'any.required': `{{#label}} is a required field`
            }),
            poin: joi_1.default.number().min(1).max(100).required().label('poin').messages({
                'number.empty': `{{#label}} cannot be an empty field`,
                'number.min': `{{#label}} should have a minimum length of {#limit}`,
                'number.max': `{{#label}} must be less than or equal to {#limit}`,
                'any.required': `{{#label}} is a required field`
            })
        })
    }
};
