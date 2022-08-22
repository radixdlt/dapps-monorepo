REGISTRY ?= eu.gcr.io/dev-container-repo


all:
    $(eval GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD | sed 's/\//-/g'))
    $(eval GIT_COMMIT=$(shell git log -1 --format=%h ))
    TAG ?= $(GIT_BRANCH)-$(GIT_COMMIT)
    REPO ?= $(REGISTRY)/network-dashboard

.PHONY: dev-server
dev-server:
	docker build -f Dockerfile --target=dev-server -t $(REPO):$(TAG) .
	docker run -it -p 5173:5173 $(REPO):$(TAG)

.PHONY: build
build:
	docker build -f Dockerfile --target=prod-server -t $(REPO):$(TAG) .

.PHONY: run-nginx
run-nginx: build
	docker run -it -p 8080:80 $(REPO):$(TAG)

build-with-remote-cache:
	#to be added so that building on CI is faster
