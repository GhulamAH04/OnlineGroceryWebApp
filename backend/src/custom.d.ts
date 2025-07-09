export interface IUserReqParam {
  email: string;
  username: string;
  role: string;
}  

declare global {
  namespace Express {
    export interface Request {
      user?: IUserReqParam;
    }
  }
}
