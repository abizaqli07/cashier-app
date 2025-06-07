import { CredentialsSignin } from "next-auth";

export class InvalidLoginError extends CredentialsSignin {
  constructor(msg: string) {
    super(msg);
    this.code = msg;
  }
}
