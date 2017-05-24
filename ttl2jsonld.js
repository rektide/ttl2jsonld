#!/usr/bin/env node
"use strict"

var
  mrwf= require( "main-routine-with-files"),
  RdfParserN3= require( "rdf-parser-n3"),
  RdfSerializerJsonld= require( "rdf-serializer-jsonld"),
  readOrExecute= require( "read-or-execute")

function rdfParseN3( data){
	var
	  iri= this&& this.iri|| "about",
	  parser= new RdfParserN3()
	return parser.parse( data, null, iri).then( parsed=> { return {
		parsed,
		prefixes: parser.rdf.prefixes
	}})
}

function rdfSerializeJsonld( graph){
	var serializer= new RdfSerializerJsonld()
	return serializer.serialize( graph.parsed)
}

function runFile( filename){
	var parse
	if( this){
		parse= this.parse
	}
	if( !parse){
		parse= rdfParseN3.bind( this)
		if( this){
			this.parse= parse
		}
	}
	return readOrExecute( filename)
		.then( parse)
		.then( rdfSerializeJsonld)
		.then( x=> JSON.stringify( x, null, "\t"))
		.then( console.log)
}

function main( opts){
	process.on( "unhandledRejection", console.error)

	// todo: get jsonld prefixes file
	var
	  ctx= Object.assign({})
	ctx.runFile= ctx.runFile|| runFile.bind( ctx)
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
