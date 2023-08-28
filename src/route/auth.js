// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')

User.create({
  email: 'test@gmail.com',
  password: 123,
  role: 1,
})

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/signup', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  return res.render('signup', {
    // вказуємо назву контейнера
    name: 'signup',
    // вказуємо назву компонентів
    component: [
      'return-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    // вказуємо назву сторінки
    title: 'Signup page',
    // ... сюди можна далі продовжувати додавати потрібні технічні дані, які будуть використовуватися в layout

    // вказуємо дані,
    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'User' },
        { value: User.USER_ROLE.ADMIN, text: 'Admin' },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Developer',
        },
      ],
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  console.log(email, password, role)

  if (!email || !password || !role) {
    return res.status(400).json({
      message: 'Error, not all field are filled',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'Error, user with this email already exists',
      })
    }

    User.create({ email, password, role })

    return res.status(200).json({
      message: 'User succesfullt created',
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Failde to create a user',
    })
  }
})

// ---------------------------------

router.get('/recovery', function (req, res) {
  return res.render('recovery', {
    name: 'recovery',

    component: ['return-button', 'field'],

    title: 'Recovery page',

    data: {},
  })
})

router.post('/recovery', function (req, res) {
  const { email } = req.body

  console.log(req.body)

  if (!email) {
    return res.status(400).json({
      message: 'Error, not all field are filled',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: "User with such email doesn't exist",
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Recovery code was succesfully sent',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ------------------------------------

router.get('/recovery-confirm', function (req, res) {
  return res.render('recovery-confirm', {
    name: 'recovery-confirm',

    component: ['return-button', 'field', 'field-password'],

    title: 'Recovery page',

    data: {},
  })
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!password || !code) {
    return res.status(400).json({
      message: 'Please fill in all the fields',
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Invalid code',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: "User with such email doesn't exist",
      })
    }

    user.password = password

    console.log(user)

    return res.status(200).json({
      message: 'Password was successfully changed',
    })
  } catch (err) {
    return res.status(400).json({
      mesage: err.mesage,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
