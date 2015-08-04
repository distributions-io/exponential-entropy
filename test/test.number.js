/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	entropy = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'number entropy', function tests() {

	it( 'should export a function', function test() {
		expect( entropy ).to.be.a( 'function' );
	});

	it( 'should compute the distribution entropy', function test() {
		assert.closeTo( entropy( 0.5 ), 1.6931472, 1e-5 );
		assert.closeTo( entropy( 1  ), 1, 1e-5 );
		assert.closeTo( entropy( 2  ), 0.3068528, 1e-5 );
		assert.closeTo( entropy( 4  ), -0.3862944, 1e-5 );
	});

	it( 'should return `NaN` for invalid values of parameter lambda', function test() {
		assert.isTrue( isnan( entropy( -1 ) ) );
	});

});
