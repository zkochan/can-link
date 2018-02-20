'use strict'
const test = require('tape')
const canLink = require('can-link')

const exdevErr = new Error('EXDEV: cross-device link not permitted')
exdevErr.code = 'EXDEV'

const eaccesErr = new Error('EACCES: permission denied, link')
eaccesErr.code = 'EACCES'

test('canLink.sync()', t => {
  t.ok(canLink.sync('package.json', 'node_modules/package.json'))
  t.notOk(canLink.sync('foo', 'bar', {
    linkSync: () => { throw exdevErr },
    unlinkSync: () => {}
  }), 'cannot link on EXDEV error')
  t.notOk(canLink.sync('foo', 'bar', {
    linkSync: () => { throw eaccesErr },
    unlinkSync: () => {}
  }), 'cannot link on EACCES error')
  t.throws(() => {
    const fsMock = {
      linkSync: () => { throw new Error('EPERM') }
    }
    canLink.sync('foo', 'bar', fsMock)
  }, /EPERM/, 'errors are passed through if they are not EXDEV')
  t.end()
})

test('canLink() returns true', t => {
  canLink('package.json', 'node_modules/package.json')
    .then(can => {
      t.ok(can)
      t.end()
    })
    .catch(t.end)
})

test('canLink() returns false', t => {
  canLink('package.json', 'node_modules/package.json', {
    link: (existingPath, newPath, cb) => cb(exdevErr),
    unlink: (p, cb) => cb()
  })
    .then(can => {
      t.notOk(can)
      t.end()
    })
    .catch(t.end)
})

test('canLink() returns false on EACCES error', t => {
  canLink('package.json', 'node_modules/package.json', {
    link: (existingPath, newPath, cb) => cb(eaccesErr),
    unlink: (p, cb) => cb()
  })
    .then(can => {
      t.notOk(can)
      t.end()
    })
    .catch(t.end)
})

test('canLink() non-exdev error passed through', t => {
  canLink('package.json', 'node_modules/package.json', {
    link: (existingPath, newPath, cb) => cb(new Error('EPERM'))
  })
    .then(can => {
      t.fail('should have failed')
    })
    .catch(err => {
      t.ok(err)
      t.end()
    })
})
