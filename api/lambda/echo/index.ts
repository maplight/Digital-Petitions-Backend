import type { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<{ ping: string }, string> = async (event) => {
    console.log(event);
    return event.arguments.ping;
};
