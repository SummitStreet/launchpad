"use strict";

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 David Padgett/Summit Street, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//** launchpad/src/main/javascript/service.js

/* global */
/* eslint-disable no-unused-vars */

/**
 * This function implements a singleton type (e.g: a service) that can install
 * named operations into a namespace.  The operation names are optionally
 * prefixed to prevent collisions with other functions.
 */

function __Service(rootNamespace, namespacePrefix, serviceDelegate) {

	//** Constants

	var __THIS = this;
	var __ROOT_NAMESPACE = rootNamespace;
	var __NAMESPACE_PREFIX = namespacePrefix == null ? "$" : namespacePrefix;
	var __SERVICE_MANAGER = new __ServiceManager(serviceDelegate == null ? __THIS : serviceDelegate);

	//** Functions

	//** Inner Classes

	function __ServiceManager(delegate) {

		//** Constants

		//** Functions

		//** Inner Classes

		//** Instance Variables

		this.__delegate = delegate;
		this.__containers = [];

		//** Instance Initializer

		//** Instance Operations

		// Adds the specified name/value pair to the provided namespace.

		this.addToNamespace = function addToNamespace(name, value) {
			__ROOT_NAMESPACE[name] = value;
			this.invokeDelegate("addToNamespace");
		};

		// Invokes an operation implemented by the delegate.

		this.invokeDelegate = function(operation) {
			if (this.__delegate != null && this.__delegate[operation] != null && this.__delegate[operation].constructor === Function) {
				delegate[operation].apply(delegate, Array.prototype.slice.call(arguments, 1));
			}
		};

		// Create the API dispatcher function that will be invoked when the API
		// is invoked within the namespace provided via the main constructor.

		this.initializeDispatcher = function(container, api) {
			var dispatcher = function __ServiceManagerApiDispatcher() {
				var args = Array.prototype.slice.call(arguments, 0);
				return (api.apply(container, args));
			};
			return (dispatcher);
		};

		// Add all named functions within the specified containers to the
		// provided namespace.

		this.install = function install(containers) {
			this.__containers = this.__containers.concat(containers);
			this.manageAliases(containers, true);
			this.invokeDelegate("install");
		};

		// Add or remove named functions and values within the specified
		// containers to the namespace provided via the main constructor.

		this.manageAliases = function(containers, addFunctions) {
			for (var i = 0; i < containers.length; ++i) {
				var container = containers[i];
				for (var j in container) {
					if (container[j] != null) {
						var name = null;
						var value = null;
						if (container[j].constructor !== Function && j[0] != "_") {
							name = __NAMESPACE_PREFIX + j;
							value = container[j];
						}
						else {
							if (container[j].constructor === Function && container[j].name.length > 0) {
								var api = container[j];
								name = __NAMESPACE_PREFIX + container[j].name;
								value = this.initializeDispatcher(container, api);
							}
						}
						if (name != null && value != null) {
							if (addFunctions) {
								this.addToNamespace(name, value);
							}
							else {
								this.removeFromNamespace(name);
							}
						}
					}
				}
			}
		};

		// Remove the specified property from the provided namespace.

		this.removeFromNamespace = function removeFromNamespace(name) {
			this.invokeDelegate("removeFromNamespace");
			if (!(delete __ROOT_NAMESPACE[name])) {
				__ROOT_NAMESPACE[name] = null;
			}
		};

		// Remove from the provided namespace all functions added by install.

		this.uninstall = function uninstall() {
			this.invokeDelegate("uninstall");
			this.manageAliases(this.__containers, false);
		};

		//** Constructor

		if (__ROOT_NAMESPACE == null) {
			throw new Error("Unable to initialize " + __THIS.constructor.name + ": No root namespace provided when instantiated.");
		}

	}

	//** Instance Variables

	//** Instance Initializer

	//** Instance Operations

	this._getServiceManager = function() {
		return (__SERVICE_MANAGER);
	};

	//** Constructor

	__SERVICE_MANAGER.install([__THIS]);
	return (__THIS);
}
