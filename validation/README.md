# E-Signatures Backend - Signature Validation Service

This service is meant to be used as an adapter layer for the API, exposing a consistent interface that is to be implemented by system adopters. This guarantees enough
freedom for end users to not be excessively constrained when adding their existing data as sources for the process of validating signatures, while ensuring that
our system only has to deal with a single set of operations.

## Usage

### Deployment

In order to deploy:

```
$ serverless deploy
```
