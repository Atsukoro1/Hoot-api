import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CheckJwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['token'];

    if (!token)
      return res.json({
        success: false,
        errors: 'You need to verify in order to perform this action',
      });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) throw new Error();
      req.body.userId = decoded._id;
      next();
    } catch (err) {
      console.log(err);
      return res.json({
        success: false,
        errors: 'You need to verify in order to perform this action',
      });
    }
  }
}
