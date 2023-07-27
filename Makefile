REGISTRY ?= eu.gcr.io/dev-container-repo


all:
    $(eval GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD | sed 's/\//-/g'))
    $(eval GIT_COMMIT=$(shell git log -1 --format=%h ))
    TAG ?= $(GIT_BRANCH)-$(GIT_COMMIT)
    REPO ?= $(REGISTRY)/network-dashboard

.PHONY: node-adapter
node-adapter:
	docker build -f Dockerfile --build-arg NPM_TOKEN=$(NPM_TOKEN) --build-arg NETWORK_NAME=$(NETWORK_NAME)  --target=dashboard -t $(REPO):$(TAG) .
	docker run -it -e  PUBLIC_NETWORK_NAME=$(NETWORK_NAME)  -e URL=http://localhost:3000/ -p 9209:9209 -p 3000:3000 $(REPO):$(TAG)

.PHONY: storybook
storybook:
	docker build -f Dockerfile --build-arg NPM_TOKEN=$(NPM_TOKEN) --build-arg NETWORK_NAME=$(NETWORK_NAME) --target=storybook -t $(REGISTRY)/dashboard-storybook:$(TAG) .
	docker run -it -p  8080:80 $(REGISTRY)/dashboard-storybook:$(TAG)

.PHONY: build
build:
	docker build -f Dockerfile --build-arg NPM_TOKEN=$(NPM_TOKEN) --build-arg NETWORK_NAME=$(NETWORK_NAME) --target=dashboard -t $(REPO):$(TAG) .

.PHONY: yarn-lock
 yarn-lock:
	docker build --output type=local,dest=lock  --build-arg NPM_TOKEN=$(NPM_TOKEN) --build-arg NETWORK_NAME=$(NETWORK_NAME) --target export-yarn-lock -f Dockerfile  .

build-with-remote-cache:
	#to be added so that building on CI is faster
