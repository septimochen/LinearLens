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

.PHONY: docker-build docker-run
docker-build:
	docker build -t linearlens .
docker-run:
	docker run --rm -p 3000:3000 linearlens

.PHONY: build-static preview-workers deploy-workers
build-static:
	npm run build:static
preview-workers:
	npm run preview:workers
deploy-workers:
	npm run deploy:workers
