class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateToken()
    this.user = {
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
      id: user.id,
    }
  }

  static generateToken = () => {
    const length = 6
    const characters =
      'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789'

    let result = ''

    for (let i = 0; i < length; i++) {
      const index = Math.floor(
        Math.random() * characters.length,
      )

      result += characters[index]
    }

    return result
  }

  static create = (user) => {
    const session = new Session(user)

    this.#list.push(session)

    return session
  }

  static get = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }
}

module.exports = {
  Session,
}
