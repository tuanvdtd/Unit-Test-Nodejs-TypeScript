import { Request, Response, NextFunction } from "express";

import { asyncHandler } from "~/core/asyncHandler";

describe("asyncHandler", () => {
  it("should call the handler and handle next middleware error", async () => {
    const handler = jest.fn();
    const next = jest.fn() as NextFunction;
    const req = {} as Request;
    const res = {} as Response;

    const error = new Error("Something went wrong");
    // Test case 1: Handler throws an error
    // mockImplementation để giả lập handler trả về Promise
    handler.mockImplementation( async () => {
      throw error;
    });


    await asyncHandler(handler)(req, res, next);
    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call the handler and not call next if no error", async () => {
    const handler = jest.fn();
    const next = jest.fn() as NextFunction;
    const req = {} as Request;
    const res = {} as Response;
    
    // Test case 2: Handler resolves successfully
    // mockImplementation để giả lập handler trả về Promise
    handler.mockImplementation( async () => {
      return 'Success';
    });

    await asyncHandler(handler)(req, res, next);
    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});