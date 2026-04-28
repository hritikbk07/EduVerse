import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('Async Error:', error);
      res.status(500).json({ message: error.message || 'Server Error' });
    });
  };
