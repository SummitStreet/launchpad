#
# The MIT License (MIT)
#
# Copyright (c) 2015 David Padgett/Summit Street, Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

#** makestuff/src/global/init_rule.mak

REPO_DIR=.makestuff
MAKESTUFF_REPO=github.com/SummitStreet/makestuff@master.git
MAKESTUFF=$(shell python -c 'import os, re, sys ; R, V = re.match(r"(.+?)(@.*)?.git", sys.argv[2]).groups() ; print os.sep.join([sys.argv[1], R, V[1:]])' $(REPO_DIR) $(MAKESTUFF_REPO))

# The default target is 'all'.

all :

### Initialize/bootstrap makestuff environment
### usage: make [-f <makefile>] init [REPO_DIR=<external_repo_base_directory>]

makestuff_init :
	@python -c 'import os, re, sys ; C = "git clone --branch {1} https://{0}.git {2}" ; R, V = re.match(r"(.+?)(@.*)?.git", sys.argv[2]).groups() ; D = os.sep.join([sys.argv[1], R, V[1:]]) ; None if os.path.isdir(D) else os.system(C.format(R, V[1:], D))' $(REPO_DIR) $(MAKESTUFF_REPO) >/dev/null 2>/dev/null
	@rm -fr $(REPO_DIR)/.tmp ; mv $(MAKESTUFF)/dist $(REPO_DIR)/.tmp ; rm -fr $(MAKESTUFF) ; mv $(REPO_DIR)/.tmp $(MAKESTUFF)

.PHONY : all makestuff_init

#** makestuff/src/javascript/javascript.mak

-include $(MAKESTUFF)/java_vars.mak
-include $(MAKESTUFF)/javascript_vars.mak
-include $(MAKESTUFF)/python_vars.mak
-include $(MAKESTUFF)/xml_vars.mak

JAVA_CLASSPATH=~/.m2/repository/javax/ws/rs/javax.ws.rs-api/2.0/javax.ws.rs-api-2.0.jar

BUILD_TARGETS=\
	$(DIST)/python/service.py \
	$(DIST)/javascript/module.js \
	$(DIST)/javascript/express-file-server/app.js \
	$(DIST)/javascript/express-file-server/package.json \
	$(DIST)/java/Class.java \
	$(DIST)/java/Interface.java \
	$(DIST)/java/jetty-jersey-rest/pom.xml \
	$(DIST)/java/jetty-jersey-rest/src/main/java/rest_api/ResourceService.java \
	$(DIST)/java/jetty-jersey-rest/src/main/webapp/WEB-INF/web.xml

$(DIST)/python/service.py : $(SRC_DIR)/python/service.py
$(DIST)/javascript/module.js : $(SRC_DIR)/javascript/module.js
$(DIST)/javascript/express-file-server/app.js : $(SRC_DIR)/javascript/express-file-server/app.js
$(DIST)/javascript/express-file-server/package.json : $(SRC_DIR)/javascript/express-file-server/package.json
$(DIST)/java/Class.java : $(SRC_DIR)/java/Class.java
$(DIST)/java/Interface.java : $(SRC_DIR)/java/Interface.java
$(DIST)/java/jetty-jersey-rest/pom.xml : $(SRC_DIR)/java/jetty-jersey-rest/pom.xml
$(DIST)/java/jetty-jersey-rest/src/main/java/rest_api/ResourceService.java : $(SRC_DIR)/java/jetty-jersey-rest/src/main/java/rest_api/ResourceService.java
$(DIST)/java/jetty-jersey-rest/src/main/webapp/WEB-INF/web.xml : $(SRC_DIR)/java/jetty-jersey-rest/src/main/webapp/WEB-INF/web.xml

-include $(MAKESTUFF)/java_rules.mak
-include $(MAKESTUFF)/javascript_rules.mak
-include $(MAKESTUFF)/python_rules.mak
-include $(MAKESTUFF)/xml_rules.mak
