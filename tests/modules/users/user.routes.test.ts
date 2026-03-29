describe('User Routes', () => {
  const mockRouter = {
    post: jest.fn(),
    get: jest.fn(),
  }

  const validateRequestMock = jest.fn().mockReturnValue('validateRequestMiddleware')
  const asyncHandlerMock = jest.fn().mockReturnValue('asyncHandlerMiddleware')
  const UserControllerMock = {
    register: 'UserController.register',
    list: 'UserController.list',
  }
  const RegisterSchemaMock = 'RegisterSchema'

  /*
  * mock hàm Router của express để kiểm tra xem các route có được định nghĩa đúng cách trong user.routes.ts hay không.
  * bằng cách mock lại Router bằng một đối tượng giả có các phương thức post và get là các hàm jest.fn() để theo dõi các lần gọi.
  * Khi user.routes.ts được import, nó sẽ sử dụng mockRouter thay vì Router thực sự.
  * cho phép chúng ta kiểm tra xem các phương thức post và get có được gọi với đúng tham số hay không.
  */
 
  jest.mock('express', () => ({
    Router: () => mockRouter,
  }))


  /*
  * mock hàm validateRequest của core/validate/validateRequest bằng 1 hàm giả trả về 'validateRequestMiddleware' 
  * để kiểm tra xem middleware này có được sử dụng đúng cách trong user.routes.ts hay không.
  */

  jest.mock('~/core/validate/validateRequest', () => ({
    validateRequest: validateRequestMock,
  }))

  jest.mock('~/core/asyncHandler', () => ({
    asyncHandler: asyncHandlerMock,
  }))

  jest.mock('~/modules/users/user.controller', () => ({
    UserController: UserControllerMock,
  }))

  jest.mock('~/modules/users/user.validation', () => ({
    RegisterSchema: RegisterSchemaMock,
  }))

  beforeEach(() => {
    mockRouter.post.mockClear()
    mockRouter.get.mockClear()
    validateRequestMock.mockClear()
    asyncHandlerMock.mockClear()
    jest.resetModules() // Tải lại user.routes.ts cho mỗi test
  })

  it('should define the /register route with the correct middlewares and controller', async () => {
    await import('~/modules/users/user.routes')

    expect(mockRouter.post).toHaveBeenCalledWith(
      '/register',
      'validateRequestMiddleware',
      'asyncHandlerMiddleware'
    )
    expect(validateRequestMock).toHaveBeenCalledWith(RegisterSchemaMock)
    expect(asyncHandlerMock).toHaveBeenCalledWith(UserControllerMock.register)
  })

  it('should define the /list route with the correct controller', async () => {
    await import('~/modules/users/user.routes')

    expect(mockRouter.get).toHaveBeenCalledWith(
      '/list',
      'asyncHandlerMiddleware'
    )
    expect(asyncHandlerMock).toHaveBeenCalledWith(UserControllerMock.list)
  })
})