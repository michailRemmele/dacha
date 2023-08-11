const { dialog } = require('electron')

module.exports = (event) => {
  const code = dialog.showMessageBoxSync({
    message: 'Are you sure you want to leave?',
    detail: 'Any unsaved changes will not be saved.',
    type: 'question',
    buttons: ['OK', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
  })

  if (code !== 0) {
    event.preventDefault()
  }
}
