"use strict"

var
  es6promisify= require( "es6-promisify"),
  glob= require( "glob")

module.exports= es6promsify( glob)
