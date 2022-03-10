import { ServiceError } from "./types";

export class VerifyTokenError extends Error {
  constructor(args: ServiceError) {
    super(args.message);
    Object.assign(this, args);
  }
}
