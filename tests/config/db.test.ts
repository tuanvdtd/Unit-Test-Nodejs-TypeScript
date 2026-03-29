
jest.mock('mongodb', () => {
  return {
    MongoClient: jest.fn( () => {
      return {
        connect: jest.fn().mockResolvedValue(undefined),
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({ users: 'users'}),
        }),
        close: jest.fn()
      }
    })
  }}  
)

describe('MongoDB Connection', () => {
  const uri = 'mongodb://localhost:27017/testdb'

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules() // reset module để đảm bảo connectMongo được import lại với mock mới
  })

  it('should connect to MongoDB and return the database instance', async () => {
    const {MongoClient} = await import ('mongodb')
    const { connectMongo } = await import ('~/config/db')
    const { logger } = await import ('~/config/logger')

    const loggerInfoSpy = jest.spyOn(logger, 'info')

    // mock 2 lần connect để test cache
    await connectMongo(uri)
    // kiểm tra logger khi connect lần đầu tiên thành công
    expect(loggerInfoSpy).toHaveBeenCalledTimes(1)
    expect(loggerInfoSpy).toHaveBeenCalledWith('Connected to MongoDB')
    await connectMongo(uri)
    expect(MongoClient).toHaveBeenCalledTimes(1) // chỉ gọi connect 1 lần

  })

  it('should throw an error if getDb is called before connectMongo', async () => {
    const { getDb } = await import ('~/config/db')
    expect(() => getDb()).toThrow('MongoDB not initialized')
  })

  it('should return the database instance from getDb after connecting', async () => {
    const { connectMongo, col } = await import ('~/config/db')
    await connectMongo(uri)
    expect(col.users()).toBeDefined()
    expect(col.users()).toEqual({ users: 'users' })
  })

  // it('should close the MongoDB connection on SIGINT', async () => {
  //   const { MongoClient } = await import ('mongodb')
  //   const { connectMongo } = await import ('~/config/db')
  //   // Spy on process.exit để kiểm tra nó được gọi sau khi đóng kết nối,
  //   // hàm bên trong mockImplementation để tránh thực sự thoát quá trình test
  //   const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never)

  //   await connectMongo(uri)
  //   const mongoClientMock = MongoClient as unknown as jest.Mock
  //   const clientInstance = mongoClientMock.mock.results[0]?.value

  //   // Simulate SIGINT signal
  //   process.emit('SIGINT' as any)
  //   // Wait for the event loop to process the signal handler
  //   await new Promise(process.nextTick)
  //   expect(clientInstance.close).toHaveBeenCalledTimes(1)
  //   expect(exitSpy).toHaveBeenCalledWith(0)

  //   exitSpy.mockRestore()
  // })
})