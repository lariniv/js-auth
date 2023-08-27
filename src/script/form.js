export const REG_EXP_EMAIL = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
)

export const REG_EXP_PASSWORD = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
)

export class Form {
  FIELD_NAME = {}
  FIELD_ERROR = {}

  value = {}
  error = {}
  disabled = true

  change = (name, value) => {
    const error = this.validate(name, value)
    this.value[name] = value

    if (error) {
      this.setError(name, error)
      this.error[name] = error
    } else {
      this.setError(name, null)
      delete this.error[name]
    }

    this.checkDisabled()
  }

  setError = (name, error) => {
    // const input = document.getElementsByName(name)[0]
    // const error = document.getElementsByName(name)[1]

    const span = document.querySelector(
      `.form__error[name = ${name}]`,
    )

    const input = document.querySelector(
      `.validation[name = ${name}]`,
    )

    // if (span) {
    //   span.innerText = error
    //   span.style.display = 'block'
    //   if (input) {
    //     input.classList.add('validation--active')
    //   } else input.classList.remove('validation--active')
    // }

    if (span) {
      span.classList.toggle(
        'form__error--active',
        Boolean(error),
      )
      span.innerText = error || ''
    }

    if (input) {
      input.classList.toggle(
        'validation--active',
        Boolean(error),
      )
    }
  }

  checkDisabled = () => {
    let disabled = false

    Object.values(this.FIELD_NAME).forEach((name) => {
      if (
        this.error[name] ||
        this.value[name] === undefined
      ) {
        disabled = true
      }
    })

    const button = document.querySelector('.form__submit')

    if (button) {
      button.classList.toggle(
        'form__submit--disabled',
        Boolean(disabled),
      )
    }

    this.disabled = disabled
  }

  validateAll = () => {
    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value[name])

      if (error) {
        this.setError(name, error)
      }
    })
  }

  setAlert = (status, text) => {
    const element = document.querySelector('.form__alert')

    element.classList.remove('form__alert--disabled')

    if (status === 'success') {
      element.className = 'form__alert form__alert--success'
    } else if (status === 'error') {
      element.className = 'form__alert form__alert--error'
    } else if (status === 'info') {
      element.className = 'form__alert form__alert--info'
    }

    if (text) {
      element.innerText = text
    }
  }
}
