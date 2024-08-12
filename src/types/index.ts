import type { JwtPayload } from 'jsonwebtoken';
import type { Request } from 'express';

export interface ISessionRequest extends Request {
  user?: JwtPayload | string;
}
