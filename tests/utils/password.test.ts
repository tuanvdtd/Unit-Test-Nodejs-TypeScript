import { hashPassword, verifyPassword } from "~/utils/password";

describe("Password Utils", () => {
  it("should hash password correctly", async () => {
    const password = "tuan@123456";
    const hashedPassword = await hashPassword(password);
    // Hash phải khác với password gốc
    expect(hashedPassword).not.toBe(password);
    // Hash phải có độ dài nhất định (bcrypt hash thường dài ~60 ký tự)
    expect(hashedPassword.length).toBeGreaterThan(50);
    // hash phải bắt đầu bằng $2a$ hoặc $2b$ tùy phiên bản bcrypt
    // dùng regex để kiểm tra định dạng hash, dấu \ dùng để escape, dấu ^ để bắt đầu chuỗi, / để bao quanh regex
    expect(hashedPassword).toMatch(/^\$2[aby]\$/);
  });

  it("should verify password correctly", async () => {
    const password = "tuan@123456";
    const hashedPassword = await hashPassword(password);
    const isVerified = await verifyPassword(password, hashedPassword);
    expect(isVerified).toBe(true);
  });

});