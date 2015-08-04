/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	entropy = require( './../lib' ),

	// Function to apply element-wise
	ENTROPY = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-entropy', function tests() {

	it( 'should export a function', function test() {
		expect( entropy ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				entropy( [1,2,3], {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				entropy( [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				entropy( new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				entropy( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			// NaN, // allowed
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( entropy( values[ i ] ) ) );
		}
	});

	it( 'should compute the distribution entropy when provided a number', function test() {
		assert.closeTo( entropy( 0.5 ), 1.6931472, 1e-5 );
		assert.closeTo( entropy( 1  ), 1, 1e-5 );
		assert.closeTo( entropy( 2  ), 0.3068528, 1e-5 );
		assert.closeTo( entropy( 4  ), -0.3862944, 1e-5 );
	});

	it( 'should compute the distribution entropy when provided a plain array', function test() {
		var lambda, actual, expected;

		lambda = [ 0.5, 1, 2, 4 ];
		expected = [ 1.6931472, 1, 0.3068528, -0.3862944 ];

		actual = entropy( lambda );
		assert.notEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate...
		actual = entropy( lambda, {
			'copy': false
		});
		assert.strictEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution entropy when provided a typed array', function test() {
		var lambda, actual, expected;

		lambda = new Float64Array ( [ 0.5,1,2,4 ] );
		expected = new Float64Array( [ 1.6931472,1,0.3068528,-0.3862944 ] );

		actual = entropy( lambda );
		assert.notEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = entropy( lambda, {
			'copy': false
		});
		expected = new Float64Array( [ 1.6931472,1,0.3068528,-0.3862944 ] );
		assert.strictEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution entropy and return an array of a specific type', function test() {
		var lambda, actual, expected;

		lambda = [ 0.5, 1, 2, 4 ];
		expected = new Int32Array( [ 1.6931472,1,0.3068528,-0.3862944 ] );

		actual = entropy( lambda, {
			'dtype': 'int32'
		});
		assert.notEqual( actual, lambda );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 4 );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution entropy using an accessor', function test() {
		var lambda, actual, expected;

		lambda = [
			{'lambda':0.5},
			{'lambda':1},
			{'lambda':2},
			{'lambda':4}
		];
		expected = [ 1.6931472, 1, 0.3068528, -0.3862944 ];

		actual = entropy( lambda, {
			'accessor': getValue
		});
		assert.notEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = entropy( lambda, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, lambda );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		function getValue( d ) {
			return d.lambda;
		}
	});

	it( 'should compute an element-wise distribution entropy and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[9,0.5]},
			{'x':[9,1]},
			{'x':[9,2]},
			{'x':[9,4]}
		];

		expected = [
			{'x':[9,1.6931472]},
			{'x':[9,1]},
			{'x':[9,0.3068528]},
			{'x':[9,-0.3862944]}
		];

		actual = entropy( data, {
			'path': 'x.1'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Specify a path with a custom separator...
		data = [
			{'x':[9,0.5]},
			{'x':[9,1]},
			{'x':[9,2]},
			{'x':[9,4]}
		];

		actual = entropy( data, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute an element-wise distribution entropy when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float64Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i / 10;
			d2[ i ] = ENTROPY( i / 10 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = entropy( mat );

		assert.deepEqual( out.data, d2 );

		// Mutate...
		out = entropy( mat, {
			'copy': false
		});
		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d2 );
	});

	it( 'should compute an element-wise distribution entropy and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float32Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i + 1;
			d2[ i ] = ENTROPY( i + 1 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = entropy( mat, {
			'dtype': 'float32'
		});

		assert.strictEqual( out.dtype, 'float32' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( entropy( [] ), [] );
		assert.deepEqual( entropy( matrix( [0,0] ) ).data, new Float64Array() );
		assert.deepEqual( entropy( new Int8Array() ), new Float64Array() );
	});

});
