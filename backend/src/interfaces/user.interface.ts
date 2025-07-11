// File: src/interfaces/user.interface.ts

export interface JwtPayload {
  userId: number;
  role: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER';
}

  
  export interface CreateUserInput {
    email: string;
    password: string;
    username?: string;
  }