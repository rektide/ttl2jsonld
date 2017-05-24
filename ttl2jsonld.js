#!/usr/bin/env node
"use strict"

var
  mrwf= require( "main-routine-with-files"),
  RdfParserN3= require( "rdf-parser-n3"),
  RdfSerializerJsonld= require( "rdf-serializer-jsonld"),
  readOrExecute= require( "read-or-execute")

function rdfParseN3( data){
	var parser= new RdfParserN3()
	return parser.parse( data, null, "welp").then( parsed=> { return {
		parsed,
		prefixes: parser.rdf.prefixes
	}})
}

function rdfSerializeJsonld( graph){
	var serializer= new RdfSerializerJsonld()
	return serializer.serialize( graph.parsed)
}

function processFile( filename){
	return readOrExecute( filename)
		.then( rdfParseN3)
		.then( rdfSerializeJsonld)
		.then( x=> JSON.stringify( x, null, "\t"))
		.then( console.log)
}

function main( opts){
	process.on( "unhandledRejection", console.error)

	// todo: get jsonld prefixes file
	var
	  ctx= Object.assign({})
	ctx.runFile= ctx.runFile|| processFile
	return mrwf( ctx)
}

module.exports= {
	rdfParseN3,
	rdfSerializeJsonld,
	main
}
if( require.main=== module){
	main()
}
