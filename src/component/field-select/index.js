class FieldSelect {
  static toggle = (target) => {
    const dropdown = target.nextElementSibling

    dropdown.toggleAttribute('active')

    setTimeout(() => {
      window.addEventListener(
        'click',
        (e) => {
          if (!dropdown.parentElement.contains(e.target)) {
            dropdown.removeAttribute('active')
          }
        },
        {
          once: true,
        },
      )
    })
  }

  static change = (target) => {
    const parent = target.parentElement.parentElement

    const dropdown = target.parentElement

    const value = parent.querySelector('.field__value')

    const active = dropdown.querySelector('*[active]')

    if (active) active.toggleAttribute('active')

    target.toggleAttribute('active')

    if (value) {
      value.innerText = target.innerText
      value.classList.remove('field__value--placeholder')
    }

    dropdown.toggleAttribute('active')
  }
}

window.fieldSelect = FieldSelect
