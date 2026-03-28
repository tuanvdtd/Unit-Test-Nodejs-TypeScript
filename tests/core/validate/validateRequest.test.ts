import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { ApiError } from "~/core/http/ApiError";
import { validateRequest, ZodEmptyObject } from "~/core/validate/validateRequest";

describe("validateRequest", () => {
  it("should validate request body successfully", () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
        age: z.number(),
      }),
      query: ZodEmptyObject,
      params: ZodEmptyObject,
    });

    const handler = validateRequest(schema);
    const req = {
      body: {
        name: "Tuan",
        age: 22,
      },
      query: {},
      params: {},
    } as any as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    handler(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should return validation error for invalid request body", () => {
    const schema = z.object({
      body: z.object({
        name: z.string().min(1),
        age: z.number().int().min(18),
      }),
      query: ZodEmptyObject,
      params: z.object({
        number: z.coerce.number().int().min(1),
      }) ,
    });
    const handler = validateRequest(schema);
    const req = {
      body: {
        name: "Tuan",
        age: "22",
      },
      query: {},
      params: {
        number: "0"
      },
    } as any as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;
    try {
      handler(req, res, next);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(next).not.toHaveBeenCalled();
      // console.log((error as any).details);
      // console.log((error as any).message);
      expect((error as any).statusCode).toBe(400);
      expect((error as any).message).toContain("Validation error");
      expect((error as any).details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "body.age",
            message: expect.any(String),
          }),
          expect.objectContaining({
            path: "params.number",
            message: expect.any(String),
          }),
        ])
      )
    }
  });
});