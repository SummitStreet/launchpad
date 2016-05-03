#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
	The MIT License (MIT)

	Copyright (c) 2016 David Padgett/Summit Street, Inc.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
"""

# launchpad/src/main/python/app.py

#pylint: disable=bare-except, bad-continuation, mixed-indentation

#{IMPORT}
from abc import ABCMeta, abstractmethod
import argparse
import codecs
import datetime
import inspect
import logging
import sys
import traceback

class CommandLineApp(object):
	"""
	This abstract class implements the shell of an command-line app.
	"""
	__metaclass__ = ABCMeta
	_version = 0.1
	start_date_time = None
	log_level = "WARNING"
	log_date_format = "%Y-%m-%d %H:%M:%S"
	log_kv_format = "{0}={1}"
	log_format = "{date} [{app}] [{level}] [{api}] [{message}] {values}"

	# Command-line args format: (name, required, type, nargs, default, action, help)
	__command_line_args = [
		("--log-level", False, str, None, log_level, None, u"set log output level"),
		("--log-date-format", False, str, None, log_date_format, None, u"set log date format"),
		("--log-kv-format", False, str, None, log_kv_format, None, u"set log key/value format"),
		("--log-format", False, str, None, log_format, None, u"set log line format")
	]

	@classmethod
	def _format_message(cls, level, message, data):
		"""
		Formats a log message.
		"""
		date = datetime.datetime.now().strftime(cls.log_date_format)
		app = sys.argv[0]
		api = inspect.stack()[2][3]
		values = ", ".join([cls.log_kv_format.format(i, j) for i, j in data.iteritems()])
		msg = cls.log_format
		return msg.format(date=date, app=app, level=level, api=api, message=message, values=values)

	@staticmethod
	def _get_elapsed_time():
		"""
		TODO
		"""
		elapsed_date_time = datetime.datetime.now() - CommandLineApp.start_date_time
		hours, minutes = divmod(elapsed_date_time.seconds, 3600)
		minutes, seconds = divmod(minutes, 60)
		return (elapsed_date_time.days * 24 + hours, minutes, seconds)

	@classmethod
	def log_debug(cls, message, **data):
		"""
		Prints a debug level log message.
		"""
		logging.debug(cls._format_message("DBG", message, data))

	@classmethod
	def log_info(cls, message, **data):
		"""
		Prints an info level log message.
		"""
		logging.info(cls._format_message("INF", message, data))

	@classmethod
	def log_critical(cls, message, **data):
		"""
		Prints a critical level log message.
		"""
		logging.critical(cls._format_message("CRI", message, data))

	@classmethod
	def log_error(cls, message, **data):
		"""
		Prints an error level log message.
		"""
		logging.error(cls._format_message("ERR", message, data))

	@classmethod
	def log_system(cls, message, **data):
		"""
		Prints a system level log message.
		"""
		logging.log(logging.SYSTEM, cls._format_message("SYS", message, data))

	@classmethod
	def log_warning(cls, message, **data):
		"""
		Prints a warning level log message.
		"""
		logging.warning(cls._format_message("WRN", message, data))

	def __init__(self, description, command_line_args, *args):
		"""
		Ensures that the comamand-line is configured/initialized.
		"""
		cli = self.__command_line_args[:]
		cli.extend(command_line_args)
		self.__config(description, cli, args)

	def __config(self, description, command_line_args, configurable_types):
		"""
		Initializes the ArgumentParser and injects command-line arguments as
		static variables into the types defined in the module.
		"""
		writer = codecs.getwriter("utf8")
		sys.stdout = writer(sys.stdout)

		# Create and initialize an ArgumentParser
		parser = argparse.ArgumentParser(description=description)
		parser.add_argument("--version", action="version", version="%(prog)s v" + str(self._version))
		for i in command_line_args:
			params = dict(required=i[1], type=i[2], nargs=i[3], default=i[4], action=i[5], help=i[6])
			parser.add_argument(i[0], **params)

		# Inject argument values into all types within the module with matching
		# names.
		for key, value in vars(parser.parse_args()).iteritems():
			for obj in configurable_types:
				if hasattr(obj, key):
					setattr(obj, key, value)

		# Initialize the Python logging module.
		logging.SYSTEM = 60
		logging.addLevelName(logging.SYSTEM, "SYSTEM")
		level = getattr(logging, self.log_level)
		logging.basicConfig(level=level, format="%(message)s")

		# Display the parameter list.
		for key, value in vars(parser.parse_args()).iteritems():
			for obj in configurable_types:
				if hasattr(obj, key):
					self.log_debug("Parameter", value=value, key=key, dest=obj.__name__)

	def initialize(self):
		"""
		App-specific initialization should occur here.
		"""
		self.log_system("Initializing {0}".format(type(self).__name__))

	def run(self):
		"""
		Runs the app.
		"""
		try:
			CommandLineApp.start_date_time = datetime.datetime.now()
			self.log_system("Running {0}".format(type(self).__name__))
			self.initialize()
			self.start()
			self.stop()
			hours, minutes, seconds = self._get_elapsed_time()
			elapsed_time = "{0}h:{1}m:{2}s".format(hours, minutes, seconds)
			self.log_system("Succeeded", elapsed_time=elapsed_time)
		except:
			hours, minutes, seconds = self._get_elapsed_time()
			elapsed_time = "{0}h:{1}m:{2}s".format(hours, minutes, seconds)
			self.log_critical("Failed", elapsed_time=elapsed_time)
			traceback.print_exc(file=sys.stdout)
			return -1
		return 0

	@abstractmethod
	def start(self):
		"""
		App-specific startup tasks should be added here.
		"""
		self.log_system("Starting {0}".format(type(self).__name__))

	def stop(self):
		"""
		App-specific shutdown tasks should be added here.
		"""
		self.log_system("Stopping {0}".format(type(self).__name__))
