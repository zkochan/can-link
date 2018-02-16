'use strict'
const test = require('tape')
const canLink = require('can-link')

test('canLink.sync()', t => {
  t.ok(canLink.sync('package.json', 'node_modules/package.json'))
  t.end()
})

test('canLink()', t => {
  canLink('package.json', 'node_modules/package.json')
    .then(can => {
      t.ok(can)
      t.end()
    })
    .catch(t.end)
})
