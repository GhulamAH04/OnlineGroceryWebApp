export interface IUser {
  id: number;
  email: string;
  username: string;
  role: string;
  image: string;
}

export interface IAuth {
  user: IUser;
  isLogin: boolean;
}
