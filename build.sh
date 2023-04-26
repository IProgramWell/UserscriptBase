#!/bin/bash

npm test && \
	npx tsc && \
	cp ./package.json ./build && \
	npm pack ./build --pack-destination ./dist && \
	rm -rf ./build