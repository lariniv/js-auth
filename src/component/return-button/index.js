document.addEventListener('DOMContentLoaded', () => {
  const returnButton =
    document.querySelector('.return-arrow')

  returnButton.addEventListener('click', () => {
    window.history.back()
  })
})
