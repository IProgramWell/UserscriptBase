#!/bin/bash

npm test && \
	npx tsc && \
	cp ./package.json ./build && \
	npm pack ./build --pack-destination ./dist && \
	rm -rf ./build && \
	mv "./dist/$npm_package_name-$npm_package_version.tgz" "./dist/$npm_package_name.tgz";