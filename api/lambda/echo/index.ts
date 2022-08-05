import type { AppSyncResolverHandler } from "aws-lambda";

export const handler: AppSyncResolverHandler<{ ping: string }, string> = async (event) => {
    return event.arguments.ping;
};
