export interface IUser {
  id: number;
  email: string;
  username: string;
  isVerified: boolean;
  role: string;
  image: string;
}

export interface IAuth {
  user: IUser;
  isLogin: boolean;
}
