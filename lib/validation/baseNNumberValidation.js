var baseNNumberUtils = require("../utils/baseNNumberUtils");

var BASE_CHARACTERS = baseNNumberUtils.BASE_CHARACTERS;
var MIN_NUMBER_BASE = 2;
var MAX_NUMBER_BASE = BASE_CHARACTERS.length;

var validateBase = function(numberBase) {
	validateBaseRange(numberBase);
};

var validateDecimalNumber = function(number) {
	var numberStr = baseNNumberUtils.convertNumberTypeToString(number);

	validateNumberIsNotNegative(numberStr);
};

var validateBaseNNumber = function(number, base) {
	var numberStr = baseNNumberUtils.convertNumberTypeToString(number);

	validateNumberIsNotNegative(numberStr);
};

var validateBaseRange = function(numberBase) {
	if(numberBase < MIN_NUMBER_BASE || numberBase > MAX_NUMBER_BASE) {
		throw new RangeError("Number base must be between " + MIN_NUMBER_BASE + " and " + MAX_NUMBER_BASE + " (found " + numberBase + ")");
	}
}

var validateNumberIsNotNegative = function(numberStr) {
	if(numberStr.length > 0 && numberStr.charAt(0) === "-") {
		throw new RangeError("Number cannot be negative (" + numberStr + ")");
	}
};

module.exports = {
	validateBase: validateBase,
	validateDecimalNumber: validateDecimalNumber,
	validateBaseNNumber: validateBaseNNumber
};