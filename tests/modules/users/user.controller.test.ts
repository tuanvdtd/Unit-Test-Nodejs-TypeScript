import { Request, Response } from 'express';

import { UserController } from '~/modules/users/user.controller';
import { UserService } from '~/modules/users/user.service';

jest.mock('~/modules/users/user.service',
  () => ({
    UserService: {
      register: jest.fn(),
      list: jest.fn(),
    },
  }),
);

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  describe('register', () => {
    it('should register a new user and return user data', async () => {
      const mockUser = { _id: '123', email: 'tuan@gmail.com', username: 'tuan' };
      (UserService.register as jest.Mock).mockResolvedValue(mockUser);

      req.body = { email: 'tuan@gmail.com', username: 'tuan', password: 'password123' };

      await UserController.register(req as Request, res as Response);
      expect(UserService.register).toHaveBeenCalledWith('tuan@gmail.com', 'tuan', 'password123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: mockUser._id, email: mockUser.email, username: mockUser.username });
    });
  });

  describe('list', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        { _id: '123', email: 'tuan@gmail.com', username: 'tuan' },
        { _id: '456', email: 'tuan2@gmail.com', username: 'tuan2' },
      ];
      (UserService.list as jest.Mock).mockResolvedValue(mockUsers);

      await UserController.list(req as Request, res as Response);
      expect(UserService.list).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
  });

});