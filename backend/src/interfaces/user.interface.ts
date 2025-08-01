// File: src/interfaces/user.interface.ts

// === DEFINISI ROLE SECARA TERSENDIRI ===
export type Role = 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER';

export interface JwtPayload {
  userId: number;
  role: Role;
}

export interface CreateUserInput {
  email: string;
  password: string;
  username?: string;
}
