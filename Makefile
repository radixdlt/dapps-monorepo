REGISTRY ?= eu.gcr.io/dev-container-repo


all:
    $(eval GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD | sed 's/\//-/g'))
    $(eval GIT_COMMIT=$(shell git log -1 --format=%h ))
    TAG ?= $(GIT_BRANCH)-$(GIT_COMMIT)
    REPO ?= $(REGISTRY)/network-dashboard

.PHONY: dashboard
dashboard:
	docker build -f Dockerfile --build-arg NPM_TOKEN=$(NPM_TOKEN) --target=dashboard -t $(REPO):$(TAG) .
	docker run -it -p 8090:80 $(REPO):$(TAG)

.PHONY: storybook
storybook:
	docker build -f Dockerfile --build-arg NPM_TOKEN=$(NPM_TOKEN) --target=storybook -t $(REGISTRY)/dashboard-storybook:$(TAG) .
	docker run -it -p  8080:80 $(REGISTRY)/dashboard-storybook:$(TAG)

.PHONY: build
build:
	docker build -f Dockerfile --build-arg NPM_TOKEN=$(NPM_TOKEN) --target=prod-server -t $(REPO):$(TAG) .

.PHONY: run-nginx
run-nginx: build
	docker run -it -p 8080:80 $(REPO):$(TAG)

build-with-remote-cache:
	#to be added so that building on CI is faster
