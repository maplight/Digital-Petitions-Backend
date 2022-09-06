import {
    S3Client,
    ListObjectsV2Command,
    ListObjectsV2CommandInput,
    _Object
} from "@aws-sdk/client-s3";
import type { ListItemsEvent, ResourceListing } from "./types";
import { getResourcePrefix } from "./util";

export async function handleGetItems(
    event: ListItemsEvent,
    client: S3Client
): Promise<ResourceListing> {
    try {
        const commandInput: ListObjectsV2CommandInput = {
            Bucket: event.bucketId,
            Prefix: getResourcePrefix(event.target)
        };

        commandInput.MaxKeys = event.limit ?? 10;

        if (event.token) {
            commandInput.ContinuationToken = event.token;
        }

        const command = new ListObjectsV2Command(commandInput);
        const results = await client.send(command);

        const items = results.Contents?.map((_) => _.Key ?? "") ?? [];

        if (results.IsTruncated) {
            return { items, token: results.NextContinuationToken };
        } else {
            return { items };
        }
    } catch (err) {
        console.log(err);
    }

    return { items: [] };
}
