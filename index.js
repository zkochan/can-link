'use strict'
const fs = require('graceful-fs')

module.exports = (existingPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.link(existingPath, newPath, err => {
      if (!err) {
        fs.unlink(newPath, () => {})
        resolve(true)
        return
      }
      if (err.code === 'EXDEV') {
        resolve(false)
        return
      }
      reject(err)
    })
  })
}

module.exports.sync = (existingPath, newPath) => {
  try {
    fs.linkSync(existingPath, newPath)
    fs.unlinkSync(newPath)
    return true
  } catch (err) {
    if (err.code === 'EXDEV') {
      return false
    }
    throw err
  }
}
