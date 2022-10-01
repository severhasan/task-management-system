import { Request, Response, NextFunction } from 'express';

export function responseInterceptor(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const json = res.json;

  res.json = function (data: Object) {
    const newData = {
      timestamp: Date.now(),
      ...data,
    };
    res.json = json;
    return res.json(newData);
  };
  next();
}
