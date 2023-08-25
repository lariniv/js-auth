class Checkbox {
  static toggle = (el) => {
    el.toggleAttribute('active')
  }
}

window.checkbox = Checkbox
