REGISTRY ?= eu.gcr.io/dev-container-repo


all:
    $(eval GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD | sed 's/\//-/g'))
    $(eval GIT_COMMIT=$(shell git log -1 --format=%h ))
    TAG ?= $(GIT_BRANCH)-$(GIT_COMMIT)
    REPO ?= $(REGISTRY)/network-dashboard


dev-server:
	docker build -f Dockerfile --target=dev-server -t $(REPO):$(TAG) .
	docker run -it -p 5173:5173 $(REPO):$(TAG)