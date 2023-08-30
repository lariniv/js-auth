// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

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

    const newUser = User.create({ email, password, role })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'User succesfullt created',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Failed to create a user',
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

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Password was successfully changed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query
  if (renew) {
    Confirm.create(email)
  }

  return res.render('signup-confirm', {
    name: 'signup-confirm',

    component: ['return-button', 'field'],

    title: 'Signup cofirm page',

    data: {},
  })
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Invalid code',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Access denied',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Code does not exist',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Code is outdated',
      })
    }

    session.user.isConfirm = true

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true

    return res.status(200).json({
      message: 'Email was succesfully verified',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }

  console.log(code, token)
})

router.get('/login', function (req, res) {
  return res.render('login', {
    name: 'login',

    component: ['return-button', 'field', 'field-password'],

    title: 'Login page',

    data: {},
  })
})

router.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: "User with such email doesn't exist",
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Invalid password',
      })
    }

    const session = Session.create(user)

    return res.status(200).json({
      message: 'You logged in',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.mesagge,
    })
  }
})

// Підключаємо роутер до бек-енду
module.exports = router
