import { expect, test } from "@jest/globals";
import type { Callback, Context } from "aws-lambda";
import hello from ".";

const dummy: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "",
    functionVersion: "",
    invokedFunctionArn: "",
    memoryLimitInMB: "",
    awsRequestId: "",
    logGroupName: "",
    logStreamName: "",

    getRemainingTimeInMillis: function (): number {
        return 1000;
    },

    done: function (error?: Error | undefined, result?: any): void {
        error ? this.fail(error) : this.succeed(result);
    },

    fail: function (error: string | Error): void {
        console.log("fail", error);
    },

    succeed: function (messageOrObject: any): void {
        console.log("succeed", messageOrObject);
    }
};

const callback: Callback = (err, res) => {
    err ? console.log("error", err) : console.log("result", res);
};

test("Simple Lambda test", async () => {
    const result = await hello({ name: "MapLight" }, dummy, callback);

    expect(result).toMatchObject({ statusCode: 200, body: "Hello, MapLight, this is a test lambda function" });
});
