#!/bin/bash

npm test && \
	npx tsc && \
	cp ./package.json ./build && \
	cp ./global.d.ts ./build && \
	cp ./webpackUtils.js ./build && \
	cp -r ./types ./build && \
	cp ./README.md ./build && \
	mkdir -p ./dist && \
	npm pack ./build --pack-destination ./dist && \
	rm -rf ./build && \
	mv "./dist/$npm_package_name-$npm_package_version.tgz" "./dist/$npm_package_name.tgz";