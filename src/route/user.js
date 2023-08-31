// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')
const { query } = require('express')

User.create({
  email: 'test@gmail.com',
  password: 123,
  role: 1,
})

User.create({
  email: 'adm@gmail.com',
  password: 123,
  role: 2,
})

User.create({
  email: 'dev@gmail.com',
  password: 123,
  role: 3,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-list', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('user-list', {
    // вказуємо назву контейнера
    name: 'user-list',
    // вказуємо назву компонентів
    component: ['return-button'],

    // вказуємо назву сторінки
    title: 'User list page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/user-list-data', function (req, res) {
  const list = User.getList()

  if (list.length === 0) {
    return res.status(400).json({
      message: 'User list is empty',
    })
  }

  return res.status(200).json({
    list: list.map(({ id, email, role }) => ({
      id,
      email,
      role,
    })),
  })
})

router.get('/user-item', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('user-item', {
    // вказуємо назву контейнера
    name: 'user-item',
    // вказуємо назву компонентів
    component: ['return-button'],

    // вказуємо назву сторінки
    title: 'User item page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

router.get('/user-item-data', function (req, res) {
  const { id } = req.query

  console.log(req.query)

  if (!id) {
    return res.status(400).json({
      message: 'Invalid id',
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: 'User not found',
    })
  }

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isConfirm: user.isConfirm,
    },
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
