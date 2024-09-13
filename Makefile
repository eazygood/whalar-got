DOCKERFILE := Dockerfile

# Define targets
.PHONY: build-dev
build-dev: 
	@echo "Building development image..."
	DOCKERFILE=$(DOCKERFILE).dev docker-compose up --build

.PHONY: build-prod
build-prod: 
	@echo "Building production image..."
	DOCKERFILE=$(DOCKERFILE).prod docker-compose up --build

.PHONY: stop
stop:
	@echo "Stopping and removing containers..."
	docker-compose down -v

.PHONY: clean
clean:
	@echo "Cleaning up..."
	docker system prune -f
	docker volume prune -f