'use strict';

// MODULES //

var isPositive = require( 'validate.io-positive-primitive' );


// FUNCTIONS //

var ln = Math.log;


// ENTROPY //

/**
* FUNCTION entropy( lambda )
*	Computes the distribution entropy for a exponential distribution with parameter lambda.
*
* @param {Number} lambda - rate parameter
* @returns {Number} distribution entropy
*/
function entropy( lambda ) {
	if ( !isPositive( lambda ) ) {
		return NaN;
	}
	return 1 - ln( lambda );
} // end FUNCTION entropy()


// EXPORTS

module.exports =  entropy;
