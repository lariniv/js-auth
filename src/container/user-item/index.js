import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserItem extends List {
  constructor() {
    super()

    this.element = document.querySelector('#user-info')
    if (!this.element) throw new Error('Element is null')

    this.id = new URL(location.href).searchParams.get('id')
    if (!this.id) location.assign('/user-list')

    this.loadData()
  }

  loadData = async () => {
    this.updateStatus(this.STATE.LOADING)

    try {
      const res = await fetch(
        `/user-item-data?id=${this.id}`,
        {
          method: 'GET',
        },
      )

      const data = await res.json()

      if (res.ok) {
        this.updateStatus(
          this.STATE.SUCCESS,
          this.convertData(data),
        )
      } else {
        this.updateStatus(this.STATE.ERROR, data)
      }
    } catch (err) {
      console.log(err)
      this.updateStatus(this.STATE.ERROR, {
        message: err.message,
      })
    }
  }

  updateView = () => {
    console.log(this.status, this.data)

    this.element.innerHTML = ''

    switch (this.status) {
      case this.STATE.LOADING:
        this.element.innerHTML = `
          <div class="data">
            <span class="data__title skeleton">Id</span>
            <span class="data__sub skeleton"></span>
          </div>

          <div class="data">
            <span class="data__title skeleton">Email</span>
            <span class="data__sub skeleton"></span>
          </div>

          <div class="data">
            <span class="data__title skeleton">Role</span>
            <span class="data__sub skeleton"></span>
          </div>

          <div class="data">
            <span class="data__title skeleton">Email validation</span>
            <span class="data__sub skeleton"></span>
          </div>
          `
        break

      case this.STATE.ERROR:
        this.element.innerHTML = `
        <span class="form__alert form__alert--error">${this.data.message}</span>`
        break

      case this.STATE.SUCCESS:
        const { id, email, role, confirm } = this.data.user

        this.element.innerHTML += `
          <div class="data">
            <span class="data__title">Id</span>
            <span class="data__sub">${id}</span>
          </div>

          <div class="data">
              <span class="data__title">E-mail</span>
              <span class="data__sub">${email}</span>
          </div>

          <div class="data">
              <span class="data__title">Role</span>
              <span class="data__sub">${role}</span>
          </div>

          <div class="data">
              <span class="data__title">Email validation</span>
              <span class="data__sub">${confirm}</span>
          </div>
          `
        break
    }
  }

  convertData = (data) => {
    return {
      ...data,
      user: {
        ...data.user,
        role: USER_ROLE[data.user.role],
        confirm: data.user.isConfirm ? 'Yes' : 'No',
      },
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!window.session || !window.session.user.isConfirm) {
      location.assign('/')
    }
  } catch (err) {
    console.log(err)
  }

  new UserItem()
})
