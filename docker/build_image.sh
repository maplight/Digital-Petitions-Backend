#!/usr/bin/env bash

if [ -z ${alpine_version+x} ]; then
  echo "alpine_version must be set"
  exit 1
fi

if [ -z ${node_version+x} ]; then
  echo "node_version must be set"
  exit 1
fi

if [ -z ${serverless_version+x} ]; then
  echo "serverless_version must be set"
  exit 1
fi

build_date=$(date +%Y-%m-%d);

# Build for local use only
docker build \
  --no-cache \
  --build-arg ALPINE_VERSION="${alpine_version}" \
  --build-arg NODE_VERSION="${node_version}" \
  --build-arg SERVERLESS_VERSION="${serverless_version}" \
  --force-rm \
  --label "name=maplight/serverless" \
  -t "maplight/serverless:${serverless_version}-node${node_version}-alpine${alpine_version}" \
  docker

# Build for multiple platforms, if we were pushing to Docker Hub
# docker buildx build \
#   --no-cache \
#   --build-arg ALPINE_VERSION="${alpine_version}" \
#   --build-arg NODE_VERSION="${node_version}" \
--build-arg SERVERLESS_VERSION="${serverless_version}" \
#   --force-rm \
#   --label "name=maplight/serverless" \
#   --platform linux/amd64,linux/arm64/v8 \
#   -t "maplight/serverless:${serverless_version}-${node_version}-alpine${alpine_version}" \
#   -o local \
#   docker

# Add the `push` flag to push to Docker Hub
  # --push \

# Modify the tag to include the build date
  # -t "maplight/serverless-node:${node_version}-alpine${alpine_version}-${build_date}" \
