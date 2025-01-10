import multer from 'multer';
import uploadConfig from '../config/upload';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const upload = multer(uploadConfig);

export const handleUploadError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      throw new AppError('File size is too large. Maximum size is 5MB.', 400);
    }
    throw new AppError(err.message, 400);
  }
  if (err) {
    throw new AppError('Error uploading file.', 400);
  }
  next();
};
