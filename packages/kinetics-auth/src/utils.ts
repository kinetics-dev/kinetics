class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotImplementedError";
  }
}

class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export { NotImplementedError, UnauthorizedError };
