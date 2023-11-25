import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { 
    signUpSchema, 
    loginSchema, 
    emailSchema 
} from './authSchema';
import AuthService from './authService';
import UserRepository from '../users/userRepository';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export const signUp = async (
    req: Request, 
    res: Response,
    next: NextFunction,
) => {
    try {
        const schema = await signUpSchema.validateAsync(req.body);

        const signUp = await authService.signUp(schema);

        return res.status(StatusCodes.OK).json(signUp);
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const schema = await loginSchema.validateAsync(req.body);

        const login = await authService.login(schema.email, schema.password);

        return res.status(StatusCodes.OK).json(login);
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const schema = await emailSchema.validateAsync(req.body);

        const forgotPassword = await authService.forgotPassword(schema.email);

        return res.status(StatusCodes.OK).json(forgotPassword);
    } catch (error) {
        next(error);
    }
};
