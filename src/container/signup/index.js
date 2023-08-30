import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

import { saveSession } from '../../script/session'

class SignupForm extends Form {
  FIELD_NAME = {
    EMAIL: 'email',
    ROLE: 'role',
    PASSWORD: 'password',
    PASSWROD_CONF: 'passwordConf',
    IS_CONFIRM: 'isConfirm',
  }
  FIELD_ERROR = {
    IS_EMPTY: 'Fill in the field, please',
    IS_BIG: 'Too long',
    EMAIL: 'Enter a valid email',
    PASSWORD:
      'Password must contain 8 charaters, including special symbol',
    PASSWORD_CONF: 'Passwords do not match',
    NOT_CONFIRM:
      "You can't use our service without agreeing with rules",
    ROLE: 'Please choose your role',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 201) {
      return this.FIELD_ERROR.IS_BIG
    }

    if (name === this.FIELD_NAME.EMAIL) {
      if (!REG_EXP_EMAIL.test(String(value))) {
        return this.FIELD_ERROR.EMAIL
      }
    }

    if (name === this.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return this.FIELD_ERROR.PASSWORD
      }
    }

    if (name === this.FIELD_NAME.PASSWROD_CONF) {
      if (
        this.value[this.FIELD_NAME.PASSWORD] !==
        String(value)
      ) {
        return this.FIELD_ERROR.PASSWORD_CONF
      }
    }

    if (name === this.FIELD_NAME.ROLE) {
      if (isNaN(value)) {
        return this.FIELD_ERROR.ROLE
      }
    }

    if (name === this.FIELD_NAME.IS_CONFIRM) {
      if (Boolean(value) === false) {
        return this.FIELD_ERROR.NOT_CONFIRM
      }
    }
  }

  submit = async () => {
    if (this.disabled == true) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('info', 'Loading...')

      try {
        const res = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
          saveSession(data.session)

          location.assign('/')
        } else this.setAlert('error', data.message)
      } catch (err) {
        this.setAlert('error', err.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.EMAIL]:
        this.value[this.FIELD_NAME.EMAIL],
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
      [this.FIELD_NAME.ROLE]:
        this.value[this.FIELD_NAME.ROLE],
    })
  }
}

window.signupForm = new SignupForm()
