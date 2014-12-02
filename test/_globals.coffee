pr = require('bluebird')
im = require('immutable')
a = require('chai').assert


pr.longStackTraces()

GLOBAL.Promise = pr
GLOBAL.a = a

asJS = (x)-> x?.toJS?() or x
GLOBAL.eq = (n, m)->
  a.deepEqual asJS(n), asJS(m)

GLOBAL.fs = require('../lib/utils').fs
GLOBAL.cproc = require('../lib/utils').cproc
GLOBAL.Immutable = im
GLOBAL.List = im.List
GLOBAL.Map = im.Map
GLOBAL.Set = im.Set
