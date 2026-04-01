import { ObjectId } from 'mongodb'

import { col } from '~/config/db'
import { UserRepo } from '~/modules/users/user.repo'
import { objectIdToString } from '~/utils/objectIdToString'

jest.mock('~/config/db', () => ({
  col: {
    users: jest.fn(),
  }
}))

jest.mock('~/utils/objectIdToString', () => ({
  objectIdToString: jest.fn(),
}))

describe('UserRepo', () => {
  const findOne = jest.fn()
  const insertOne = jest.fn()
  const find = jest.fn()
  const toArray = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    find.mockReturnValue({ toArray })
    ;(col.users as jest.Mock).mockReturnValue({
      findOne,
      insertOne,
      find,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = {
        _id: new ObjectId(),
        email: 'tuan@gmail.com',
        username: 'tuan',
        password_hash: 'password123',
        role: 'user',
      }
      findOne.mockResolvedValue(user)

      const result = await UserRepo.findByEmail('tuan@gmail.com')

      expect(col.users).toHaveBeenCalledTimes(1)
      expect(findOne).toHaveBeenCalledWith({ email: 'tuan@gmail.com' })
      expect(result).toEqual(user)
    })

    it('should return null if user not found', async () => {
      findOne.mockResolvedValue(null)

      const result = await UserRepo.findByEmail('tuan@gmail.com')

      expect(findOne).toHaveBeenCalledWith({ email: 'tuan@gmail.com' })
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const now = new Date()
      const user = {
        email: 'tuan@gmail.com',
        username: 'tuan',
        password_hash: 'password123',
        role: 'user',
      }
      const insertedId = new ObjectId()
      insertOne.mockResolvedValue({ insertedId })
      ;(objectIdToString as jest.Mock).mockReturnValue(insertedId.toString())

      jest.useFakeTimers().setSystemTime(now)
      const result = await UserRepo.create(user)

      expect(insertOne).toHaveBeenCalledWith({
        ...user,
        createdAt: now,
        updatedAt: now,
      })
      // updateAt và createdAt sẽ được set bằng now, nên khi so sánh kết quả trả về, chúng ta cũng cần đảm bảo rằng chúng có giá trị giống nhau
      expect(result.createdAt).toEqual(now)
      expect(result.updatedAt).toEqual(now)
      expect(objectIdToString).toHaveBeenCalledWith(insertedId)
      expect(result).toEqual({
        ...user,
        _id: insertedId.toString(),
        createdAt: now,
        updatedAt: now,
      })
    })
  });

  describe('list', () => {
    it('should list all users', async () => {
      const users = [
        {
          _id: new ObjectId(),
          email: 'tuan@gmail.com',
          username: 'tuan',
          password_hash: 'password123',
          role: 'user',
        },
        { 
          _id: new ObjectId(),
          email: 'tuan2@gmail.com',
          username: 'tuan2',
          password_hash: 'password123',
          role: 'user',
        },
      ]
      find.mockReturnValue({ toArray })
      toArray.mockResolvedValue(users)

      const result = await UserRepo.list()

      expect(find).toHaveBeenCalledTimes(1)
      expect(toArray).toHaveBeenCalledTimes(1)
      expect(result).toEqual(users)
    })
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const user = {
        _id: new ObjectId(),
        email: 'tuan@gmail.com',
        username: 'tuan',
        password_hash: 'password123',
        role: 'user',
      }
      findOne.mockResolvedValue(user)

      const result = await UserRepo.findById(user._id.toString())

      expect(findOne).toHaveBeenCalledWith({ _id: new ObjectId(user._id.toString()) })
      expect(result).toEqual(user)
    })

    it('should return null if user not found', async () => {
      const id = new ObjectId().toString()
      findOne.mockResolvedValue(null)

      const result = await UserRepo.findById(id)

      expect(findOne).toHaveBeenCalledWith({ _id: new ObjectId(id) })
      expect(result).toBeNull()
    })
  });
})
      

