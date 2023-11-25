import { Request, Response, NextFunction } from 'express'; 
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import Unauthenticated from '../errors/Unauthenticated';
import { 
    UNIQUE_EMAIL,
    UNIQUE_USERNAME,
    UNIQUE_CONSTRAINT,
    VALIDATION_ERROR,
    VALIDATION_ERROR_CODE,
 } from '../auth/constants';

export const errorMiddleware = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction,
) => {
    if (err instanceof Unauthenticated) {
        return res.status(err.statusCode).json({
            success: false,
            data: err.message,
        });
    }

    if (err instanceof Joi.ValidationError) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            success: false,
            data: err.details[0].message,
        });
    }

    if (err.name === VALIDATION_ERROR && err.code === VALIDATION_ERROR_CODE) {
        const field = Object.keys(err.keyPattern)[0];

        if (field === 'email') {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                success: false,
                data: UNIQUE_EMAIL,
            });
        } else if (field === 'username') {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                success: false,
                data: UNIQUE_USERNAME,
            });
        } else {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                success: false,
                data: UNIQUE_CONSTRAINT,
            });
        }
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(err.message);
        console.log(err.stack);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: err.message,
            stack: err.stack,
        });
    } 
    else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Something went wrong.',
        });
    }
};
