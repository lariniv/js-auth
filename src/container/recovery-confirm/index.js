import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

class RecoveryConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
    PASSWORD: 'password',
    PASSWROD_CONF: 'passwordConf',
  }
  FIELD_ERROR = {
    IS_EMPTY: 'Fill in the field, please',
    IS_BIG: 'Too long',
    PASSWORD:
      'Password must contain 8 charaters, including special symbol',
    PASSWORD_CONF: 'Passwords do not match',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 201) {
      return this.FIELD_ERROR.IS_BIG
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
  }

  submit = async () => {
    if (this.disabled == true) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('info', 'Loading...')

      try {
        const res = await fetch('/recovery-confirm', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: this.convertData(),
        })

        const data = await res.json()

        if (res.ok) {
          this.setAlert('success', data.message)
        } else this.setAlert('error', data.message)
      } catch (err) {
        this.setAlert('error', err.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
    })
  }
}

window.recoveryConfirmForm = new RecoveryConfirmForm()
