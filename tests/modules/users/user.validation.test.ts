import { RegisterSchema} from '~/modules/users/user.validation'

describe('User Validation', () => {

  const createRegisterData = (overrides = {}) => ({
    body: {
      email: 'tuan@gmail.com',
      username: 'tuan',
      password: 'password123',
      ...overrides,
    },
    query: {},
    params: {},
  })

  it('should validate correct registration data', () => {
    const data = createRegisterData()
    const result = RegisterSchema.safeParse(data)
    expect(result.success).toBe(true)

  } )

  it('should throw an error for invalid email', () => {
    const data = createRegisterData({ email: 'invalid-email' })
    const result = RegisterSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should throw an error for short username', () => {
    const data = createRegisterData({ username: 'a' })
    const result = RegisterSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should throw an error for short password', () => {
    const data = createRegisterData({ password: 'short' })
    const result = RegisterSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})