"use strict";

/* global $foo, $bar, $globalVariable, $_name */
/* eslint-disable no-console, no-unused-vars */

console.log("");
var $$test = new (require("fn-test.js"))();
var __Service = require("./service-node.js");

$$test.message("service-test.js", "Unit tests for service.js/__Service");

var type = function(name) {

	var __SELF = this;
	this.globalVariable = "type.globalVariable-" + name;
	this._name = name;
	this._installed = "";
	this._uninstalled = "";

	this._delegate = new (function() {
		this.install = function() {
			__SELF._installed = "installed";
		};

		this.uninstall = function() {
			__SELF._uninstalled = "uninstalled";
		};

	})();

	this.foo = function foo() {
		return (this._name + "foo");
	};

	this.bar = function bar() {
		return (this._name + "bar");
	};

	this.foobar = function() {
		return (this._name + "foobar");
	};

};

$$test.message("service-test.js", "obj1 has no service delegate");

var obj1 = __Service.apply(new type("obj1"), [global, "$"]);

$$test.assertTrue("obj1: type.globalVariable is global", function() {return $globalVariable == "type.globalVariable-obj1";});
$$test.assertTrue("obj1: type._name is not global", function() {return typeof($_name) == "undefined";});
$$test.assertTrue("obj1: type.foo is installed", function() {return $foo() == "obj1foo";});
$$test.assertTrue("obj1: type.bar is installed", function() {return $bar() == "obj1bar";});
$$test.assertTrue("obj1: type.foobar is not installed", function() {return typeof($foobar) == "undefined";});
$$test.assertTrue("obj1: Service.install not delegated", function() {return obj1._installed != "installed";});

$$test.message("service-test.js", "obj2 has a service delegate");

var obj2 = new type("obj2");
__Service.apply(obj2, [global, "$", obj2._delegate]);

$$test.assertTrue("obj2: type.globalVariable is global", function() {return $globalVariable == "type.globalVariable-obj2";});
$$test.assertTrue("obj2: type._name is not global", function() {return typeof($_name) == "undefined";});
$$test.assertTrue("obj2: type.foo is installed", function() {return $foo() == "obj2foo";});
$$test.assertTrue("obj2: type.bar is installed", function() {return $bar() == "obj2bar";});
$$test.assertTrue("obj2: type.foobar is not installed", function() {return typeof($foobar) == "undefined";});
$$test.assertTrue("obj2: install is delegated", function() {return obj2._installed == "installed";});

$$test.summary();
process.exit($$test.getResult() ? 0 : 1);

