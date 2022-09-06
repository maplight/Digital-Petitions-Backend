import { S3Client } from "@aws-sdk/client-s3";
import type { Handler } from "aws-lambda";
import { handleGetItems } from "./get-items";
import { handleGetUploadUrl } from "./get-upload-url";
import { handleGetCurrentVersion } from "./get-version";
import { Actions, AssetsEvent, ResourceListing } from "./types";

const client = new S3Client({});

export const handler: Handler<AssetsEvent> = async (
    event
): Promise<string | ResourceListing | null> => {
    switch (event.type) {
        case Actions.GetCurrentVersion:
            return await handleGetCurrentVersion(event, client);

        case Actions.GetUploadUrl:
            return await handleGetUploadUrl(event, client);

        case Actions.GetResourceList:
            return await handleGetItems(event, client);

        default:
            return null;
    }
};
