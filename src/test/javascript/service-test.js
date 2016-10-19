"use strict";

// launchpad/src/test/javascript/module-test.js

/* global $foo, $bar, $globalVariable, $_name */
/* eslint-disable no-console, no-unused-vars */

console.log("");
var $$test = new (require("fn-test.js"))();
var __Service = require("./service-node.js");

$$test.message("service-test.js", "Unit tests for service.js/__Service");

var type1 = function(name) {

	var __SELF = this;
	this.globalVariable = "type1.globalVariable-" + name;
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

$$test.message("service-test.js", "external test - obj1 has no service delegate");

var obj1 = __Service.apply(new type1("obj1"), [global, "$"]);

$$test.assertTrue("obj1: type1.globalVariable is global", function() {return $globalVariable == "type1.globalVariable-obj1";});
$$test.assertTrue("obj1: type1._name is not global", function() {return typeof($_name) == "undefined";});
$$test.assertTrue("obj1: type1.foo is installed", function() {return $foo() == "obj1foo";});
$$test.assertTrue("obj1: type1.bar is installed", function() {return $bar() == "obj1bar";});
$$test.assertTrue("obj1: type1.foobar is not installed", function() {return typeof($foobar) == "undefined";});
$$test.assertTrue("obj1: Service.install not delegated", function() {return obj1._installed != "installed";});

$$test.message("service-test.js", "external test - obj2 has a service delegate");

var obj2 = new type1("obj2");
__Service.apply(obj2, [global, "$", obj2._delegate]);

$$test.assertTrue("obj2: type1.globalVariable is global", function() {return $globalVariable == "type1.globalVariable-obj2";});
$$test.assertTrue("obj2: type1._name is not global", function() {return typeof($_name) == "undefined";});
$$test.assertTrue("obj2: type1.foo is installed", function() {return $foo() == "obj2foo";});
$$test.assertTrue("obj2: type1.bar is installed", function() {return $bar() == "obj2bar";});
$$test.assertTrue("obj2: type1.foobar is not installed", function() {return typeof($foobar) == "undefined";});
$$test.assertTrue("obj2: install is delegated", function() {return obj2._installed == "installed";});

var type2 = function(name, selfDelegate) {

	var __SELF = this;

	this.globalVariable = "type2.globalVariable-" + name;
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

	__Service.apply(this, [global, "$", selfDelegate ? this._delegate : null]);
};

$$test.message("service-test.js", "internal test - obj3 has no service delegate");

var obj3 = new type2("obj3", false);

$$test.assertTrue("obj3: type2.globalVariable is global", function() {return $globalVariable == "type2.globalVariable-obj3";});
$$test.assertTrue("obj3: type2._name is not global", function() {return typeof($_name) == "undefined";});
$$test.assertTrue("obj3: type2.foo is installed", function() {return $foo() == "obj3foo";});
$$test.assertTrue("obj3: type2.bar is installed", function() {return $bar() == "obj3bar";});
$$test.assertTrue("obj3: type2.foobar is not installed", function() {return typeof($foobar) == "undefined";});
$$test.assertTrue("obj3: Service.install not delegated", function() {return obj3._installed != "installed";});

$$test.message("service-test.js", "external test - obj4 has a service delegate");

var obj4 = new type2("obj4", true);

$$test.assertTrue("obj4: type1.globalVariable is global", function() {return $globalVariable == "type2.globalVariable-obj4";});
$$test.assertTrue("obj4: type1._name is not global", function() {return typeof($_name) == "undefined";});
$$test.assertTrue("obj4: type1.foo is installed", function() {return $foo() == "obj4foo";});
$$test.assertTrue("obj4: type1.bar is installed", function() {return $bar() == "obj4bar";});
$$test.assertTrue("obj4: type1.foobar is not installed", function() {return typeof($foobar) == "undefined";});
$$test.assertTrue("obj4: install is delegated", function() {return obj4._installed == "installed";});

$$test.summary();
process.exit($$test.getResult() ? 0 : 1);
