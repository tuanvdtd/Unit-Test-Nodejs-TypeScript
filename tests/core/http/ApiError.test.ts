import { StatusCodes } from "http-status-codes";

import { ApiError } from "~/core/http/ApiError";

describe("ApiError", () => {
  it("should create an ApiError instance with correct properties", () => {
    const error = new ApiError(StatusCodes.BAD_REQUEST, "Invalid input", { field: "email" });
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.message).toBe("Invalid input");
    expect(error.details).toEqual({ field: "email" });
    // Kiểm tra stack trace có tồn tại và chứa tên class
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ApiError");
    // kiểm tra có phải string hay không
    expect(typeof error.stack).toBe("string");
  });

  it("should create an ApiError instance using the static BadRequest method", () => {
    const error = ApiError.BadRequest("Missing required field", { field: "username" });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.message).toBe("Missing required field");
    expect(error.details).toEqual({ field: "username" });
  });

  it("should create an ApiError instance with default message when using static BadRequest method without message", () => {
    const error = ApiError.BadRequest();
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(error.message).toBe("Bad Request");
    expect(error.details).toBeUndefined();
  });
  
});

