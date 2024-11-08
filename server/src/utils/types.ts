import { Request } from "express";

//posso aggiungere user a req object senza errori statici di ts
interface Req extends Request {
  user?: any;
}

export { Req };
