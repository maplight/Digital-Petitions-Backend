import type { Handler } from "aws-lambda";

export default <Handler<{ name: string }, { statusCode: number; body: string }>>(async (
    event
): Promise<any> => ({
    statusCode: 200,
    body: `Hello, ${event.name}, this is a test lambda function`
}));
