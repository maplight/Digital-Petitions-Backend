import type { Handler } from "aws-lambda";

const _: Handler = async (event, _context): Promise<any> => ({
    statusCode: 200,
    body: {
        message: "Typescript Lambda test",
        input: event
    }
});

export default _;
