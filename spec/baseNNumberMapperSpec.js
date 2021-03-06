var BaseNNumberMapper = require("../lib/mappers/BaseNNumberMapper");
var ValueError = require("../lib/errors/ValueError");

describe("A Base-N Number Mapper", function() {

	it("should throw a RangeError when given a negative number", function() {
		var bnnm = new BaseNNumberMapper();

		expect(function() {
			bnnm.fromDecimal(-5);
		}).toThrowError(RangeError);

		expect(function() {
			bnnm.toDecimal(-5);
		}).toThrowError(RangeError);

		expect(function() {
			bnnm.fromDecimal("-10011010");
		}).toThrowError(RangeError);
	});

	it("should throw a RangeError when given a base outside of an acceptable range", function() {
		expect(function() {
			// jshint unused: false
			var bnnm = new BaseNNumberMapper(1);
		}).toThrowError(RangeError);

		expect(function() {
			// jshint unused: false
			var bnnm = new BaseNNumberMapper(37);
		}).toThrowError(RangeError);

		expect(function() {
			// jshint unused: false
			var bnnm = new BaseNNumberMapper(-8);
		}).toThrowError(RangeError);
	});

	it("can convert binary numbers to decimal", function() {
		var baseNNumberMapper = new BaseNNumberMapper(2);

		expect(baseNNumberMapper.toDecimal(0)).toBe(0);
		expect(baseNNumberMapper.toDecimal(1)).toBe(1);
		expect(baseNNumberMapper.toDecimal(10)).toBe(2);
		expect(baseNNumberMapper.toDecimal(101010)).toBe(42);
		expect(baseNNumberMapper.toDecimal(11111111)).toBe(255);
	});

	it("can convert octal numbers to decimal", function() {
		var baseNNumberMapper = new BaseNNumberMapper(8);

		expect(baseNNumberMapper.toDecimal(0)).toBe(0);
		expect(baseNNumberMapper.toDecimal(7)).toBe(7);
		expect(baseNNumberMapper.toDecimal(123)).toBe(83);
		expect(baseNNumberMapper.toDecimal(765)).toBe(501);
		expect(baseNNumberMapper.toDecimal(1750)).toBe(1000);
		expect(baseNNumberMapper.toDecimal(23420)).toBe(10000);
	});

	it("can convert hexadecimal numbers to decimal", function() {
		var baseNNumberMapper = new BaseNNumberMapper(16);

		expect(baseNNumberMapper.toDecimal(0)).toBe(0);
		expect(baseNNumberMapper.toDecimal("F")).toBe(15);
		expect(baseNNumberMapper.toDecimal("BEEF")).toBe(48879);
		expect(baseNNumberMapper.toDecimal("ABCDEF")).toBe(11259375);
		expect(baseNNumberMapper.toDecimal("FABF00D")).toBe(262926349);
		expect(baseNNumberMapper.toDecimal(123456789)).toBe(4886718345);
	});

	it("can convert base-36 numbers to decimal", function() {
		var baseNNumberMapper = new BaseNNumberMapper(36);

		expect(baseNNumberMapper.toDecimal(0)).toBe(0);
		expect(baseNNumberMapper.toDecimal("Z")).toBe(35);
		expect(baseNNumberMapper.toDecimal("00000Z")).toBe(35);
		expect(baseNNumberMapper.toDecimal("AZ")).toBe(395);
		expect(baseNNumberMapper.toDecimal("Z00")).toBe(45360);
	});

	it("can convert decimal numbers to binary", function() {
		var baseNNumberMapper = new BaseNNumberMapper(2);

		expect(baseNNumberMapper.fromDecimal(0)).toBe("0");
		expect(baseNNumberMapper.fromDecimal(1)).toBe("1");
		expect(baseNNumberMapper.fromDecimal(2)).toBe("10");
		expect(baseNNumberMapper.fromDecimal(42)).toBe("101010");
		expect(baseNNumberMapper.fromDecimal(255)).toBe("11111111");
		expect(baseNNumberMapper.fromDecimal(65536)).toBe("10000000000000000");
		expect(baseNNumberMapper.fromDecimal(2097153)).toBe("1000000000000000000001");
	});

	it("can convert decimal numbers to octal", function() {
		var baseNNumberMapper = new BaseNNumberMapper(8);

		expect(baseNNumberMapper.fromDecimal(0)).toBe("0");
		expect(baseNNumberMapper.fromDecimal(7)).toBe("7");
		expect(baseNNumberMapper.fromDecimal(83)).toBe("123");
		expect(baseNNumberMapper.fromDecimal(501)).toBe("765");
		expect(baseNNumberMapper.fromDecimal(1000)).toBe("1750");
		expect(baseNNumberMapper.fromDecimal(10000)).toBe("23420");
	});

	it("can convert decimal numbers to hexadecimal", function() {
		var baseNNumberMapper = new BaseNNumberMapper(16);

		expect(baseNNumberMapper.fromDecimal(0)).toBe("0");
		expect(baseNNumberMapper.fromDecimal(15)).toBe("F");
		expect(baseNNumberMapper.fromDecimal(48879)).toBe("BEEF");
		expect(baseNNumberMapper.fromDecimal(11259375)).toBe("ABCDEF");
		expect(baseNNumberMapper.fromDecimal(262926349)).toBe("FABF00D");
		expect(baseNNumberMapper.fromDecimal(4886718345)).toBe("123456789");
	});

	it("can convert decimal numbers to base-36", function() {
		var baseNNumberMapper = new BaseNNumberMapper(36);

		expect(baseNNumberMapper.fromDecimal(0)).toBe("0");
		expect(baseNNumberMapper.fromDecimal(35)).toBe("Z");
		expect(baseNNumberMapper.fromDecimal(395)).toBe("AZ");
		expect(baseNNumberMapper.fromDecimal(45360)).toBe("Z00");
	});

	it("ignores fractional part of numbers when option is not true", function() {
		var baseNNumberMapper = new BaseNNumberMapper(2);
		expect(baseNNumberMapper.fromDecimal(3.125)).toBe("11");
		expect(baseNNumberMapper.toDecimal("111.11")).toBe(7);

		var mapperOptions = {
			fractionalBaseN: false
		};
		baseNNumberMapper = new BaseNNumberMapper(2, mapperOptions);
		expect(baseNNumberMapper.fromDecimal(3.125)).toBe("11");
		expect(baseNNumberMapper.toDecimal("111.11")).toBe(7);
	});

	it("can convert fractional binary numbers to decimal numbers", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(2, mapperOptions);

		expect(baseNNumberMapper.toDecimal("111.001")).toBeCloseTo(7.125, 3);
		expect(baseNNumberMapper.toDecimal("1000.0001")).toBeCloseTo(8.0625, 4);
		expect(baseNNumberMapper.toDecimal("0.00001")).toBeCloseTo(0.03125, 5);
		expect(baseNNumberMapper.toDecimal("0.00000000")).toBeCloseTo(0, 8);
		expect(baseNNumberMapper.toDecimal("1.111111111")).toBeCloseTo(1.998046875, 9);
	});

	it("can convert fractional octal numbers to decimal numbers", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(8, mapperOptions);

		expect(baseNNumberMapper.toDecimal("3.007")).toBeCloseTo(3.013671875, 9);
		expect(baseNNumberMapper.toDecimal("1000.1234")).toBeCloseTo(512.163085938, 9);
		expect(baseNNumberMapper.toDecimal("7.777")).toBeCloseTo(7.998046875, 9);
	});

	it("can convert fractional hexadecimal numbers to decimal numbers", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(16, mapperOptions);

		expect(baseNNumberMapper.toDecimal("AB.00F")).toBeCloseTo(171.003662109, 9);
		expect(baseNNumberMapper.toDecimal("C000.FFF")).toBeCloseTo(49152.999755859, 9);
	});

	it("can convert decimal numbers to fractional binary numbers", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(2, mapperOptions);

		expect(baseNNumberMapper.fromDecimal(5.125)).toBe("101.001");
		expect(baseNNumberMapper.fromDecimal(64.015625)).toBe("1000000.000001");
		expect(baseNNumberMapper.fromDecimal(31.9921875)).toBe("11111.1111111");
	});

	it("can convert decimal numbers to fractional octal numbers", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(8, mapperOptions);

		expect(baseNNumberMapper.fromDecimal(8.25)).toBe("10.2");
		expect(baseNNumberMapper.fromDecimal(511.998046875)).toBe("777.777");
		expect(baseNNumberMapper.fromDecimal(1.000003815)).toBe("1.000001");
		expect(baseNNumberMapper.fromDecimal(0.0078125)).toBe("0.004");
	});

	it("can convert decimal numbers to fractional hexadecimal numbers", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(16, mapperOptions);

		expect(baseNNumberMapper.fromDecimal(16.75)).toBe("10.C");
		expect(baseNNumberMapper.fromDecimal(4095.99609375)).toBe("FFF.FF");
		expect(baseNNumberMapper.fromDecimal(873.80859375)).toBe("369.CF");
	});

	it("will not include fractional part when converting from integer decimal numbers", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(2, mapperOptions);

		expect(baseNNumberMapper.fromDecimal(18)).toBe("10010");
	});

	it("can accept only options parameter and default to appropriate base", function() {
		var mapperOptions = {
			fractionalBaseN: true
		};
		var baseNNumberMapper = new BaseNNumberMapper(mapperOptions);

		expect(baseNNumberMapper.fromDecimal(10.584)).toBe(10.584);
		expect(baseNNumberMapper.toDecimal(10.584)).toBe(10.584);
	});

	it("can accept numbers of type string or number", function() {
		var baseNNumberMapper = new BaseNNumberMapper(2);

		expect(baseNNumberMapper.toDecimal(111)).toBe(7);
		expect(baseNNumberMapper.toDecimal("111")).toBe(7);
		expect(baseNNumberMapper.toDecimal(10101010)).toBe(170);
		expect(baseNNumberMapper.toDecimal("10101010")).toBe(170);
	});

	it("only accepts characters appropriate for the chosen base", function() {

		expect(function() {
			var bnnm = new BaseNNumberMapper(2);
			bnnm.toDecimal("01210");
		}).toThrowError(ValueError);

		expect(function() {
			var bnnm = new BaseNNumberMapper(8);
			bnnm.toDecimal("15873");
		}).toThrowError(ValueError);

		expect(function() {
			var bnnm = new BaseNNumberMapper(16);
			bnnm.toDecimal("ABCDEFG");
		}).toThrowError(ValueError);

	});

	it("only allows certain characters for each number", function() {
		var bnnm = new BaseNNumberMapper();

		expect(function() {
			bnnm.toDecimal("?");
		}).toThrowError(ValueError);
	});

});
