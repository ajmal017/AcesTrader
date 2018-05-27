/*!
 * accounting.js v0.3.2
 * Copyright 2011, Joss Crowcroft
 *
 * Freely distributable under the MIT license.
 * Portions of accounting.js are inspired or borrowed from underscore.js
 *
 * Full details and documentation:
 * http://josscrowcroft.github.com/accounting.js/
 *
 * NOTE: This Code has been modified by BCM, 11/5/2017.
 * For use in MoneyPlan app, it uses the CommonJS module system .
 *
 */

/* ---Crockford Scripts */

//Crockford augments function.prototype with a "method" method,
//so that we no longer have to type the name of the prototype property.
//We easily add methods to some objects to handle common problems.

//Function.prototype.method = function (name, func) {
//    if (this.prototype[name]) {
//        throw ({ error: "method exists", message: "Function.prototype.method '" + name + "' already defined." });
//    } else {
//        this.prototype[name] = func;
//        return this;
//    }
//}

// eslint-disable-next-line
Function.prototype.method = function(name, func) {
  this.prototype[name] = func
  return this
}

//Trim spaces from the ends of a string
String.method('trim', function() {
  return this.replace(/^\s+|\s+$/g, '')
})
//console.log('"' + "    neat trick    ".trim() + '"'); // "neat trick"

//Return the integer part of a number
Number.method('integer', function() {
  return Math[this < 0 ? 'ceil' : 'floor'](this)
})
//var xx = (-10 / 3);
//console.log(xx.integer()); // -3

//Return an integer dollar amount, rounding fractional part
Number.method('amount', function() {
  return Math['round'](this)
})
//zz = (100 * .03999);
//console.log(zz.amount()); // $100 * 4% = 3.999 ==> $4

//Return a decimal number rounded to x decimal places (for percentages)
Number.method('percent', function(x) {
  x = x || 0
  var d = Math.pow(10, x) //10 ^ x;
  return Math['round'](this * d) / d
})
//yy = (.1 * .039999);
//console.log(yy.percent(3)); // 4% of 10%  = .003999 ==> 0.4%
/* ---End Of Crockford Scripts --- */

// The library's settings object.
// Contains default parameters for currency and number formatting.
// These are fixed as shown, by BCM for use in MoneyPlan, 11/4/2017.
var settings = {
  currency: {
    symbol: '$', // default currency symbol is '$'
    format: '%s%v', // controls output: %s = symbol, %v = value (can be object, see docs)
    decimal: '.', // decimal point separator
    thousand: ',', // thousands separator
    precision: 2, // decimal places
    grouping: 3, // digit grouping (not implemented yet)
  },
  number: {
    precision: 0, // default precision on numbers is 0
    grouping: 3, // digit grouping (not implemented yet)
    thousand: ',',
    decimal: '.',
  },
}

/* --- Internal Helper Methods --- */

// Store reference to possibly-available ECMAScript 5 methods for later
var nativeMap = Array.prototype.map,
  nativeIsArray = Array.isArray,
  toString = Object.prototype.toString

/**
 * Tests whether supplied parameter is a string
 * from underscore.js
 */
function isString(obj) {
  return !!(obj === '' || (obj && obj.charCodeAt && obj.substr))
}

/**
 * Tests whether supplied parameter is a string
 * from underscore.js, delegates to ECMA5's native Array.isArray
 */
function isArray(obj) {
  return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]'
}

/**
 * Tests whether supplied parameter is a true object
 */
function isObject(obj) {
  return obj && toString.call(obj) === '[object Object]'
}

/**
 * Extends an object with a defaults object, similar to underscore's _.defaults
 *
 * Used for abstracting parameter handling from API methods
 */
function defaults(object, defs) {
  var key
  object = object || {}
  defs = defs || {}
  // Iterate over object non-prototype properties:
  for (key in defs) {
    if (defs.hasOwnProperty(key)) {
      // Replace values with defaults only if undefined (allow empty/zero values):
      if (object[key] === null) object[key] = defs[key]
    }
  }
  return object
}

/**
 * Implementation of `Array.map()` for iteration loops
 *
 * Returns a new Array as a result of calling `iterator` on each array value.
 * Defers to native Array.map if available
 */
function map(obj, iterator, context) {
  var results = [],
    i,
    j

  if (!obj) return results

  // Use native .map method if it exists:
  if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context)

  // Fallback for native .map:
  for (i = 0, j = obj.length; i < j; i++) {
    results[i] = iterator.call(context, obj[i], i, obj)
  }
  return results
}

/**
 * Check and normalise the value of precision (must be positive integer)
 */
function checkPrecision(val, base) {
  val = Math.round(Math.abs(val))
  return isNaN(val) ? base : val
}

/**
 * Parses a format string or object and returns format obj for use in rendering
 *
 * `format` is either a string with the default (positive) format, or object
 * containing `pos` (required), `neg` and `zero` values (or a function returning
 * either a string or object)
 *
 * Either string or format.pos must contain "%v" (value) to be valid
 */
function checkCurrencyFormat(format) {
  var defaults = settings.currency.format

  // Allow function as format parameter (should return string or object):
  if (typeof format === 'function') format = format()

  // Format can be a string, in which case `value` ("%v") must be present:
  if (isString(format) && format.match('%v')) {
    // Create and return positive, negative and zero formats:
    return {
      pos: format,
      neg: format.replace('-', '').replace('%v', '-%v'),
      zero: format,
    }

    // If no format, or object is missing valid positive value, use defaults:
  } else if (!format || !format.pos || !format.pos.match('%v')) {
    // If defaults is a string, casts it to an object for faster checking next time:
    return !isString(defaults)
      ? defaults
      : (settings.currency.format = {
          pos: defaults,
          neg: defaults.replace('%v', '-%v'),
          zero: defaults,
        })
  }
  // Otherwise, assume format was fine:
  return format
}

/* --- API Methods --- */

/**
 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
 * alias: accounting.`parse(string)`
 *
 * Decimal must be included in the regular expression to match floats (defaults to
 * accounting.settings.number.decimal), so if the number uses a non-standard decimal
 * separator, provide it as the second argument.
 *
 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
 *
 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
 */
exports.unformat = function(value, decimal) {
  // Recursively unformat arrays:
  if (isArray(value)) {
    return map(value, function(val) {
      return this.unformat(val, decimal)
    })
  }

  // Fails silently (need decent errors):
  value = value || 0

  // Return the value as-is if it's already a number:
  if (typeof value === 'number') return value

  // Default decimal point comes from settings, but could be set to eg. "," in opts:
  decimal = decimal || settings.number.decimal

  // Build regex to strip out everything except digits, decimal point and minus sign:
  var regex = new RegExp('[^0-9-' + decimal + ']', ['g']),
    unformatted = parseFloat(
      ('' + value)
        .replace(/\((.*)\)/, '-$1') // replace bracketed values with negatives
        .replace(regex, '') // strip out any cruft
        .replace(decimal, '.') // make sure decimal point is standard
    )

  // This will fail silently which may cause trouble, let's wait and see:
  return !isNaN(unformatted) ? unformatted : 0
}

/**
 * Implementation of toFixed() that treats floats more like decimals
 *
 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
 * problems for accounting- and finance-related software.
 */
exports.toFixed = function(value, precision) {
  precision = checkPrecision(precision, settings.number.precision)
  var power = Math.pow(10, precision)

  // Multiply up by precision, round accurately, then divide and use native toFixed():
  return (Math.round(this.unformat(value) * power) / power).toFixed(precision)
}

/**
 * Format a number, with comma-separated thousands and custom precision/decimal places
 *
 * Localise by overriding the precision and thousand / decimal separators
 * 2nd parameter `precision` can be an object matching `settings.number`
 */
exports.formatNumber = function(number, precision2, thousand2, decimal2) {
  var output
  var precision = precision2 || 0
  var thousand = thousand2 || ','
  var decimal = decimal2 || '.'

  // Resursively format arrays:
  if (isArray(number)) {
    return map(number, function(val) {
      return this.formatNumber(val, precision, thousand, decimal)
    })
  }

  // Clean up number:
  number = this.unformat(number)

  // Build options object from second param (if object) or all params, extending defaults:
  var opts = defaults(
      isObject(precision)
        ? precision
        : {
            precision: precision,
            thousand: thousand,
            decimal: decimal,
          },
      settings.number
    ),
    // Clean up precision
    usePrecision = checkPrecision(opts.precision),
    // Do some calc:
    negative = number < 0 ? '-' : '',
    base = parseInt(this.toFixed(Math.abs(number || 0), usePrecision), 10) + '',
    mod = base.length > 3 ? base.length % 3 : 0

  // Format the number:
  output =
    negative +
    (mod ? base.substr(0, mod) + opts.thousand : '') +
    base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + opts.thousand) +
    (usePrecision ? opts.decimal + this.toFixed(Math.abs(number), usePrecision).split('.')[1] : '')
  return output
}

/**
 * Format a number into currency
 *
 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
 * defaults: (0, "$", 2, ",", ".", "%s%v")
 *
 * Localise by overriding the symbol, precision, thousand / decimal separators and format
 * Second param can be an object matching `settings.currency` which is the easiest way.
 *
 * To do: tidy up the parameters
 */
exports.formatMoney = function(number, symbol, precision, thousand, decimal, format) {
  // Resursively format arrays:
  if (isArray(number)) {
    return map(number, function(val) {
      return this.formatMoney(val, symbol, precision, thousand, decimal, format)
    })
  }

  // Clean up number:
  number = this.unformat(number)

  // Build options object from second param (if object) or all params, extending defaults:
  var opts = defaults(
      isObject(symbol)
        ? symbol
        : {
            symbol: symbol,
            precision: precision,
            thousand: thousand,
            decimal: decimal,
            format: format,
          },
      settings.currency
    ),
    // Check format (returns object with pos, neg and zero):
    formats = checkCurrencyFormat(opts.format),
    // Choose which format to use for this value:
    useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero

  // Return with currency symbol added:
  return useFormat.replace('%s', opts.symbol).replace('%v', this.formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal))
}

/**
 * Format a list of numbers into an accounting column, padding with whitespace
 * to line up currency symbols, thousand separators and decimals places
 *
 * List should be an array of numbers
 * Second parameter can be an object containing keys that match the params
 *
 * Returns array of accouting-formatted number strings of same length
 *
 * NB: `white-space:pre` CSS rule is required on the list container to prevent
 * browsers from collapsing the whitespace in the output strings.
 */
exports.formatColumn = function(list, symbol, precision, thousand, decimal, format) {
  if (!list) return []

  // Build options object from second param (if object) or all params, extending defaults:
  var opts = defaults(
      isObject(symbol)
        ? symbol
        : {
            symbol: symbol,
            precision: precision,
            thousand: thousand,
            decimal: decimal,
            format: format,
          },
      settings.currency
    ),
    // Check format (returns object with pos, neg and zero), only need pos for now:
    formats = checkCurrencyFormat(opts.format),
    // Whether to pad at start of string or after currency symbol:
    padAfterSymbol = formats.pos.indexOf('%s') < formats.pos.indexOf('%v') ? true : false,
    // Store value for the length of the longest string in the column:
    maxLength = 0,
    // Format the list according to options, store the length of the longest string:
    formatted = map(list, function(val, i) {
      if (isArray(val)) {
        // Recursively format columns if list is a multi-dimensional array:
        return this.formatColumn(val, opts)
      } else {
        // Clean up the value
        val = this.unformat(val)

        // Choose which format to use for this value (pos, neg or zero):
        var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,
          // Format this value, push into formatted list and save the length:
          fVal = useFormat.replace('%s', opts.symbol).replace('%v', this.formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal))

        if (fVal.length > maxLength) maxLength = fVal.length
        return fVal
      }
    })

  // Pad each number in the list and send back the column of numbers:
  return map(formatted, function(val, i) {
    // Only if this is a string (not a nested array, which would have already been padded):
    if (isString(val) && val.length < maxLength) {
      // Depending on symbol position, pad after symbol or at index 0:
      return padAfterSymbol ? val.replace(opts.symbol, opts.symbol + new Array(maxLength - val.length + 1).join(' ')) : new Array(maxLength - val.length + 1).join(' ') + val
    }
    return val
  })
}

//**
//*  This code is not originally part of this module. Added by BCM 11/7/2017.
//*

//**
//*  This code is not originally part of this module. Added by BCM 12/27/2014.
//*
exports.formatBirthDate = function(birthdate) {
  // This formates the PlanObject's birthday string "2/19/1965"
  // into the more readable string "Feb 19 1965".

  var months = [
    // "January", "February", "March",
    // "April", "May", "June", "July",
    // "August", "September", "October",
    // "November", "December"
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]

  //See the link below for documentation re this technique
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
  const replacer = function(match, p1, p2, p3, offset, string) {
    var month = months[p1 - 1]
    return [month, p2, p3].join(' ')
  }

  var reg = /([0-9]+)\/([0-9]+)\/([0-9]+)/
  var datestring = birthdate.replace(reg, replacer)
  return datestring
}

exports.formatPercent = function(percentValue) {
  //******
  //****** Note: this calls the percent() method copied here from the crockford.scripts.js module
  //******

  var getPercentString

  if (percentValue === undefined || percentValue === -1) {
    getPercentString = -1 //percent never specified
  } else if (percentValue === 1) {
    getPercentString = '100'
  } else if (percentValue >= 0.1) {
    getPercentString = Math.floor(100 * percentValue.percent(2)).toString() // "#0%"
  } else if (percentValue >= 0.01) {
    getPercentString = (100 * percentValue.percent(3)).toFixed(1).toString() // "#.0%"
  } else if (Number(percentValue) === 0) {
    getPercentString = '0'
  } else {
    getPercentString = (100 * percentValue.percent(4)).toFixed(2).toString() //  "0.#0%"
  }

  if (getPercentString === -1) {
    return //returns "Undefined" to prevent this value being used by the caller for display
  }

  return getPercentString + '%'
}

//****  This code is not originally part of this module. Added by BCM 1/28/2015. ****
//Falling back to using "TaxNormalLongTerm" so that we can test xml strings against older example files still using that.
//But legacy plan files may be using "TaxNormalLongTermRealizedGains", and that should override in the calculations,
//yet not effect the generated output xml string so that our output tests can still be used.
//Here we test the value of both properties and return the value that is to be used in the program.

exports.getPropertyValue = function(taxNormalLongTermRealizedGains, taxNormalLongTerm) {
  var value1 = taxNormalLongTermRealizedGains //this is left undefined by default so as not to be included in the output xml file, if not present in the input xml file
  var value2 = taxNormalLongTerm //this is set to false by default
  if (typeof value1 === 'undefined' || value1 === null || value1.length === 0) {
    // isNullOrEmpty
    return value2 // we will use the standard property value
  }
  if (value1 === -1 || value1 === false) {
    //could be set to this by a legacy input xml file, so it will be included in the output xml file.
    return value2 // we will use the standard property value
  }
  return value1 // this legacy property value overrides the standard one since it was set by a legacy input xml file
}

////****  This code is not originally part of this module. Added by BCM 1/30/2015. ****
////Falling back to using "specifictaxrateforthisaccount" so that we can test xml strings against older example files still using that.
////But legacy plan files may be using the newer "specificfedtaxrateforthisaccount", and that should override in the calculations,
////yet not effect the generated output xml string so that our output tests can still be used.
////Here we test the value of both properties and return the value that is to be used in the program.
//var getPropertyValue2 = lib.getPropertyValue2 = function (specificfedtaxrateforthisaccount, specifictaxrateforthisaccount) {
//	var value1 = specificfedtaxrateforthisaccount; //this is left undefined by default so as not to be included in the output xml file, if not present in the input xml file
//	var value2 = specifictaxrateforthisaccount; //this is left undefined by default also
//	if (typeof value1 === 'undefined' || value1 === null || value1.length === 0) { // isNullOrEmpty
//		return value2; // we will use the standard property value
//	}
//	if (value1 === -1 || value1 === false) { //could be set to this by a legacy input xml file, so it will be included in the output xml file.
//		return value2; // we will use the standard property value
//	}
//	return value1; // this legacy property value overrides the standard one since it was set by a legacy input xml file
//}
