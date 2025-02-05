class Unauthorized extends Error {
  status: number = 401;
  name: string = "Unauthorized";
  constructor(message: string) {
    super(message);
  }
}

class BadRequest extends Error {
  status: number = 400;
  name: string = "Bad Request";
  constructor(message: string) {
    super(message);
  }
}

class NotFound extends Error {
  status: number = 404;
  name: string = "Not Found";
  constructor(message: string) {
    super(message);
  }
}

export { Unauthorized, BadRequest, NotFound };