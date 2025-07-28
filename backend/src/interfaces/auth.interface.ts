import { Role } from "@prisma/client";
export interface IRegister {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface IGoogleRegister {
  name: string;
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IGoogleLogin {
  name: string;
  email: string;
}
