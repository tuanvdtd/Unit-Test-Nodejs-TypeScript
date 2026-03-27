import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { env } from "~/config/env";
import { ApiError } from "~/core/http/ApiError";
import { errorHandler } from "~/core/http/errorHandler";

function createHttpMocks() {
  const req = {} as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;

  return { req, res, next };
}

describe("errorHandler", () => {
  const originalNodeEnv = env.NODE_ENV;

  afterEach(() => {
    // Khôi phục NODE_ENV; mock/spy đã được cleanup ở jest.setup.ts.
    env.NODE_ENV = originalNodeEnv;
  });

  it("should handle ApiError correctly", () => {

    const mockError = new ApiError(StatusCodes.BAD_REQUEST, "Custom error message", { info: "Additional details" });
    const { req, res, next } = createHttpMocks();

    errorHandler(mockError, req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "Custom error message",
      details: { info: "Additional details" },
    });
  });

  it("should handle unknown errors with 500 status", () => {
    const mockError = new Error("Unknown error");
    const { req, res, next } = createHttpMocks();

    errorHandler(mockError, req, res, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });

  it("should log unhandled errors in development", () => {
    // errorHandler chỉ log console.error khi chạy ở development.
    env.NODE_ENV = "development";

    // Spy console.error để verify có log, đồng thời chặn output ra terminal.
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const mockError = new Error("Unknown error");
    const { req, res, next } = createHttpMocks();

    errorHandler(mockError, req, res, next);

    expect(consoleErrorSpy).toHaveBeenCalledWith("[Unhandled Error]", mockError);
  });
  
});