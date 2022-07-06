import type { Handler } from "aws-lambda";

export const hello: Handler = (event, _context, callback) =>
    callback(null, {
        statusCode: 200,
        body: {
            message: "Typescript Lambda test",
            input: event
        }
    });
