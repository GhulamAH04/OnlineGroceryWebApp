// File: src/utils/jwt.ts

import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/user.interface';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'secret'; // fallback dev

export const signJwt = (payload: JwtPayload, expiresIn: `${number}${'s' | 'm' | 'h' | 'd'}` = '1d') => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

/*
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/user.interface';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'secret'; // fallback untuk dev

export const signJwt = (payload: JwtPayload, expiresIn: string = '1d') => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
*/

