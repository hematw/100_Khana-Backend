import { NextFunction, Request, Response } from "express";
import { MongoServerError } from "mongodb";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err.code === 11000) {
    const duplicateError = Object.entries(err.keyValue);
    const duplicateField = duplicateError[0][0];
    const duplicateValue = duplicateError[0][1];
    let customMessage: string = "";
    if (duplicateField === "username") {
      customMessage = `${duplicateField} ${duplicateValue} is not available!`;
    } else if (duplicateField === "email") {
      customMessage = `There is already an account with ${duplicateValue}`;
    }
    return res.status(409).json({
      success: false,
      message: customMessage,
      duplicateField,
    });
  } 
  // else if(err instanceof )
  res.status(400).json({ err });
};

export default errorHandler;
