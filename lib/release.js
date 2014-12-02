var debug = require('debug')('release')
var Immutable = require('immutable')
var Sequence = require('./sequence')



module.exports = Release
module.exports.use = use
module.exports.plan = plan



// Create a new release
function Release(userSettings) {

  /* A release has information about how it is configured and a pluggable
  sequence of operations. It is this sequence that actually houses all logic.
  The outer shell is just a dumb vessel. */
  var release = {}
  release.config = processUserSettings(userSettings)
  release.sequence = Sequence()

  return releaseDecorator(release)
}



function releaseDecorator(release) {

  // Add an action to the release's sequence
  release.registerAction = function(action) {
    release.sequence = Sequence.registerAction(release.sequence, action)
    return release
  }

  // Register a plugin on this release
  release.use = use.bind(null, release)

  release.plan = plan.bind(null, release)

  return release
}



// Create a new a instance of release with plugin registered.
function use(release, plugin) {
  return plugin(release)
}

// Transition each action into confirm state
function plan(release) {
  var reading = release.sequence.map(function(action) {
  })

  return Promise.all(reading.toJS())
}



// Validate and normalize user settings
function processUserSettings(userSettings) {
  return Immutable.fromJS(userSettings)
}
