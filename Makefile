.PHONY: dev build start test lint typecheck check format
dev:
	npm run dev
build:
	npm run build
start:
	npm run start
test:
	npm test
lint:
	npm run lint
typecheck:
	npm run typecheck
check: test lint typecheck build
format:
	npm run format
