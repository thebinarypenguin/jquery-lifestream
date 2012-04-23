src = ../src
services = $(src)/services
build = .
main = ..
modules = $(src)/core.js $(services)/*.js
jls = $(main)/jquery.lifestream.js
jls_min = $(main)/jquery.lifestream.min.js


.PHONY: all jls jls-min

all: jls jls-min

jls: $(jls)
	
jls-min: $(jls_min)
		
$(jls): $(modules) | $(main)
	@echo "Building $@"
	@cat $^ > $@

$(jls_min): $(jls)
	@echo "Building $@"
	@uglifyjs $^ > $@

