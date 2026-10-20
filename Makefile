# Every team fills in the commands for their own stack.
# The CI pipeline calls these targets, so the names must not change.
#
# Examples:
#   Node    install: npm ci          test: npm test        build: npm run build
#   Python  install: pip install -r requirements.txt
#                                    test: pytest          build: echo "no build step"
#   Java    install: ./mvnw -B dependency:go-offline
#                                    test: ./mvnw test     build: ./mvnw package

.PHONY: install test build run docker-build docker-up

install:
	@echo "No third-party dependencies are required."
	@node --version

test:
	node --test tests/*.test.js

build:
	node --check app.js
	test -s index.html
	test -s login.html
	test -s signup.html
	test -s add-expense.html
	test -s contact.html

run:
	python3 -m http.server 8000

# Needed from M4 onwards
docker-build:
	@echo "TODO: docker build for frontend and backend" && exit 1

docker-up:
	docker compose up --build
