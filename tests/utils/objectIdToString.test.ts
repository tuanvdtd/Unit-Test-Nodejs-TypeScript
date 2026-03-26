import { ObjectId } from "mongodb";

import { objectIdToString } from "~/utils/objectIdToString";

describe("objectIdToString", () => {
  it("should convert ObjectId to string", () => {
    const objectId = new ObjectId();
    const result = objectIdToString(objectId);
    expect(result).toBe(objectId.toHexString());
    // Kiểm tra đúng định dạng của 1 chuỗi ObjectId mongodb gồm 24 ký tự hex từ 0-9 và a-f
    expect(result).toMatch(/^[a-f0-9]{24}$/);
  });
});