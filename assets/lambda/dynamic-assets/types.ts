export enum Actions {
    GetUploadUrl = "get-upload-url",
    GetCurrentVersion = "get-current-version"
}

export enum ResourceType {
    Logo = "site-logo"
}

export const prefixMapping: Record<ResourceType, string> = {
    [ResourceType.Logo]: "logo"
};

export type AssetsEvent = { type: Actions; target: ResourceType; bucketId: string };
export const DYNAMIC_ASSET_PATH_PREFIX = "_assets";