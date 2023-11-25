import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from './userService';
import UserRepository from '../users/userRepository';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const getAllUsers = async (
    req: Request & {user?: any}, 
    res: Response,
    next: NextFunction,
) => {
    try {
        const users = await userService.getAllUsers();

        return res.status(StatusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
};