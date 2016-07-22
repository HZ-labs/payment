var payment =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var Payment, cardFromNumber, cardFromType, cards, defaultFormat, luhnCheck, trim,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	defaultFormat = /(\d{1,4})/g;

	trim = function(el) {
	  return el.toString().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};

	cards = [
	  {
	    type: 'amex',
	    pattern: /^3[47]/,
	    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
	    length: [15],
	    cvcLength: [4],
	    luhn: true
	  }, {
	    type: 'dankort',
	    pattern: /^5019/,
	    format: defaultFormat,
	    length: [16],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'dinersclub',
	    pattern: /^(36|38|30[0-5])/,
	    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
	    length: [14],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'discover',
	    pattern: /^(6011|65|64[4-9]|622)/,
	    format: defaultFormat,
	    length: [16],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'jcb',
	    pattern: /^35/,
	    format: defaultFormat,
	    length: [16],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'laser',
	    pattern: /^(6706|6771|6709)/,
	    format: defaultFormat,
	    length: [16, 17, 18, 19],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'maestro',
	    pattern: /^(5018|5020|5038|6304|6703|6759|676[1-3])/,
	    format: defaultFormat,
	    length: [12, 13, 14, 15, 16, 17, 18, 19],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'mastercard',
	    pattern: /^5[1-5]/,
	    pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
	    format: defaultFormat,
	    length: [16],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'unionpay',
	    pattern: /^62/,
	    format: defaultFormat,
	    length: [16, 17, 18, 19],
	    cvcLength: [3],
	    luhn: false
	  }, {
	    type: 'visaelectron',
	    pattern: /^4(026|17500|405|508|844|91[37])/,
	    format: defaultFormat,
	    length: [16],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'elo',
	    pattern: /^4011|438935|45(1416|76|7393)|50(4175|6699|67|90[4-7])|63(6297|6368)/,
	    format: defaultFormat,
	    length: [16],
	    cvcLength: [3],
	    luhn: true
	  }, {
	    type: 'visa',
	    pattern: /^4/,
	    format: defaultFormat,
	    length: [13, 16, 19],
	    cvcLength: [3],
	    luhn: true
	  }
	];

	cardFromNumber = function(num) {
	  var card, i, len;
	  num = (num + '').replace(/\D/g, '');
	  for (i = 0, len = cards.length; i < len; i++) {
	    card = cards[i];
	    if (card.pattern.test(num)) {
	      return card;
	    }
	  }
	};

	cardFromType = function(type) {
	  var card, i, len;
	  for (i = 0, len = cards.length; i < len; i++) {
	    card = cards[i];
	    if (card.type === type) {
	      return card;
	    }
	  }
	};

	luhnCheck = function(num) {
	  var digit, digits, i, len, odd, sum;
	  odd = true;
	  sum = 0;
	  digits = (num + '').split('').reverse();
	  for (i = 0, len = digits.length; i < len; i++) {
	    digit = digits[i];
	    digit = parseInt(digit, 10);
	    if ((odd = !odd)) {
	      digit *= 2;
	    }
	    if (digit > 9) {
	      digit -= 9;
	    }
	    sum += digit;
	  }
	  return sum % 10 === 0;
	};

	Payment = (function() {
	  function Payment() {}

	  Payment.fns = {
	    cardExpiryVal: function(value) {
	      var month, prefix, ref, year;
	      value = value.replace(/\s/g, '');
	      ref = value.split('/', 2), month = ref[0], year = ref[1];
	      if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
	        prefix = (new Date).getFullYear();
	        prefix = prefix.toString().slice(0, 2);
	        year = prefix + year;
	      }
	      month = parseInt(month, 10);
	      year = parseInt(year, 10);
	      return {
	        month: month,
	        year: year
	      };
	    },
	    validateCardNumber: function(num) {
	      var card, ref;
	      num = (num + '').replace(/\s+|-/g, '');
	      if (!/^\d+$/.test(num)) {
	        return false;
	      }
	      card = cardFromNumber(num);
	      if (!card) {
	        return false;
	      }
	      return (ref = num.length, indexOf.call(card.length, ref) >= 0) && (card.luhn === false || luhnCheck(num));
	    },
	    validateCardExpiry: function(month, year) {
	      var currentTime, expiry, prefix, ref;
	      if (typeof month === 'object' && 'month' in month) {
	        ref = month, month = ref.month, year = ref.year;
	      }
	      if (!(month && year)) {
	        return false;
	      }
	      month = trim(month);
	      year = trim(year);
	      if (!/^\d+$/.test(month)) {
	        return false;
	      }
	      if (!/^\d+$/.test(year)) {
	        return false;
	      }
	      month = parseInt(month, 10);
	      if (!(month && month <= 12)) {
	        return false;
	      }
	      if (year.length === 2) {
	        prefix = (new Date).getFullYear();
	        prefix = prefix.toString().slice(0, 2);
	        year = prefix + year;
	      }
	      expiry = new Date(year, month);
	      currentTime = new Date;
	      expiry.setMonth(expiry.getMonth() - 1);
	      expiry.setMonth(expiry.getMonth() + 1, 1);
	      return expiry > currentTime;
	    },
	    validateCardCVC: function(cvc, type) {
	      var ref, ref1;
	      cvc = trim(cvc);
	      if (!/^\d+$/.test(cvc)) {
	        return false;
	      }
	      if (type && cardFromType(type)) {
	        return ref = cvc.length, indexOf.call((ref1 = cardFromType(type)) != null ? ref1.cvcLength : void 0, ref) >= 0;
	      } else {
	        return cvc.length >= 3 && cvc.length <= 4;
	      }
	    },
	    cardType: function(num) {
	      var ref;
	      if (!num) {
	        return null;
	      }
	      return ((ref = cardFromNumber(num)) != null ? ref.type : void 0) || null;
	    },
	    formatCardNumber: function(num) {
	      var card, groups, ref, upperLength;
	      card = cardFromNumber(num);
	      if (!card) {
	        return num;
	      }
	      upperLength = card.length[card.length.length - 1];
	      num = num.replace(/\D/g, '');
	      num = num.slice(0, +upperLength + 1 || 9e9);
	      if (card.format.global) {
	        return (ref = num.match(card.format)) != null ? ref.join(' ') : void 0;
	      } else {
	        groups = card.format.exec(num);
	        if (groups != null) {
	          groups.shift();
	        }
	        return groups != null ? groups.join(' ') : void 0;
	      }
	    }
	  };

	  Payment.getCardArray = function() {
	    return cards;
	  };

	  Payment.setCardArray = function(cardArray) {
	    cards = cardArray;
	    return true;
	  };

	  Payment.addToCardArray = function(cardObject) {
	    return cards.push(cardObject);
	  };

	  Payment.removeFromCardArray = function(type) {
	    var key, value;
	    for (key in cards) {
	      value = cards[key];
	      if (value.type === type) {
	        cards.splice(key, 1);
	      }
	    }
	    return true;
	  };

	  return Payment;

	})();

	module.exports = Payment;


/***/ }
/******/ ]);