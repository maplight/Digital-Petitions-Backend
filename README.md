# Digital-Petitions-Backend

Backend repository for the E-Signatures app. Built using Serverless Framework, it is split into individual services in order to facilitate development and keep a good separation of concerns. Check the individual README files inside each service for details.

# Docker Instructions

## Building

To build the image, run the following:

```sh
alpine_version=3.18 node_version=18.17.1 serverless_version=3.35.1 ./docker/build_image.sh
```

Once built, the image is used in the `docker-compose.yml` file as the
base image for the service(s). Make sure the image name is updated to
match the options entered during build.

## Environment

The Docker Compose configuration requires `env` files.

- `.env` to store default keys (and values) used to configure
various services and libraries.
- `.env.local` a git ignored file that provides a way to override values
from `.env` for local development.

Ensure the local file exists:

```sh
touch .env.local
```

## Installing

To install the node dependencies, run the following:

```sh
docker-compose run --rm sc
```

## Running

To run commands in the `sc` service (top-level [serverless compose](https://www.serverless.com/framework/docs/guides/compose)),
run the following:

```sh
docker-compose run --rm sc COMMAND
```

You can run any `serverless` compose command in place of `COMMAND`.
