import { Request, Response } from "express";
module.exports = (fn: Function) => {
  return (req: Request, res: Response, next: any) => {
    fn(req, res, next).catch(next);
  };
};
