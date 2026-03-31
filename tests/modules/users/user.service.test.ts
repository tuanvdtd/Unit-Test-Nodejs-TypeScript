import bcryptjs from 'bcryptjs'

import { UserRepo } from '~/modules/users/user.repo'
import { UserService } from '~/modules/users/user.service'
import { UserRole } from '~/modules/users/user.types'

jest.mock('~/modules/users/user.repo', () => ({
  UserRepo: {
    findByEmail: jest.fn(),
    create: jest.fn(),
    list: jest.fn(),
  }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}))


describe('UserService', () => {

  describe('register', () => {
    it('should error when registering with an existing email', async () => {
      const email = 'tuan@gmail.com'
      const username = 'tuan'
      const password = 'password123'
      // Mock UserRepo.findByEmail to return a user
      ;(UserRepo.findByEmail as jest.Mock).mockResolvedValue({ email })

      await UserService.register(email, username, password).catch((err) => {
        expect(err.message).toBe('Email already exists')
        expect(err.statusCode).toBe(409)
      })

      expect(UserRepo.findByEmail).toHaveBeenCalledWith(email)
      expect(bcryptjs.hash).not.toHaveBeenCalled()
      expect(UserRepo.create).not.toHaveBeenCalled()
    })

    it('should create a new user when email does not exist', async () => {
      const email = 'newuser@gmail.com'
      const username = 'tuan'
      const password = 'password123'
      // Mock UserRepo.findByEmail to return null
      ;(UserRepo.findByEmail as jest.Mock).mockResolvedValue(null)

      // Mock UserRepo.create to return the created user
      const createdUser = { email, username, password_hash: 'hashedPassword', role: UserRole.USER }

      ;(UserRepo.create as jest.Mock).mockResolvedValue(createdUser)
      // Mock bcrypt.hash to return a hashed password
      ;(bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword')

      const result = await UserService.register(email, username, password)

      expect(UserRepo.findByEmail).toHaveBeenCalledWith(email)
      expect(bcryptjs.hash).toHaveBeenCalledWith(password, 10)
      expect(UserRepo.create).toHaveBeenCalledWith(createdUser)
      expect(result).toEqual(createdUser)
    })
  });

  describe('list', () => {
    it('should return a list of users', async () => {
      const users = [
        { email: 'tuan@gmail.com', username: 'tuan' },
        { email: 'tuan2@gmail.com', username: 'tuan2' },
      ] as any
      ;(UserRepo.list as jest.Mock).mockResolvedValue(users)

      const result = await UserService.list()

      expect(UserRepo.list).toHaveBeenCalled()
      expect(result).toEqual(users)
    })
  })

})

