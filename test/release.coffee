Release = require('../lib/release')

Plugin = (config)->
  name: config?.name || 'fooPlugin'
  scan: -> new Promise (r)-> setTimeout(r, 10, { foo: 'bar' })
  steps: []



describe 'Release()', ->

  it 'Creates an instance of release', ->
    a Release().has 'plugins'
    a.isFunction Release().use

  it '.use(plugin) creates new instance of release including given plugin', ->
    plugin = Plugin()
    r1 = Release()
    r2 = r1.use(plugin)
    r3 = r2.use(plugin)
    eq r1.get('plugins').size, 0
    eq r2.get('plugins').toJS(), [plugin]
    eq r3.get('plugins').toJS(), [plugin, plugin]


  describe '.scan()', ->

    it 'creates a new instance of release including scan data', ->
      Release()
      .use(Plugin(name:'a'))
      .use(Plugin(name:'b'))
      .scan()
      .then (release)->
        eq release.get('scans').toJS(), a:{foo:'bar'}, b:{foo:'bar'}
