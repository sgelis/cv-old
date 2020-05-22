all: dist

clean:
	rm -rf dist

dist: src
	./node_modules/grunt/bin/grunt

run: dist
	php -S localhost:8000 -t dist
