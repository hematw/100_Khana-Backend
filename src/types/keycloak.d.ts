import "express";

declare module "express-serve-static-core" {
  interface Request {
    kauth?: {
      grant?: {
        access_token?: {
          content?: {
            sub: string;
            email?: string;
            name?: string;
          };
        };
      };
    };
  }
}
