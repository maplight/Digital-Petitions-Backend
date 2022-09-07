export enum Actions {
    GetUploadUrl = "get-upload-url",
    GetCurrentVersion = "get-current-version",
    GetResourceList = "get-resource-list",
    CheckIsValid = "check-is-valid"
}

export enum ResourceType {
    Logo = "site-logo"
}

export const prefixMapping: Record<ResourceType, string> = {
    [ResourceType.Logo]: "logo"
};

export type HasResourceTarget = { target: ResourceType };
export type HasBucketTarget = { bucketId: string };

export type SingleItemEvent = HasResourceTarget & {
    type: Actions.GetCurrentVersion | Actions.GetUploadUrl;
} & HasBucketTarget;

export type CheckItemValidEvent = HasBucketTarget & {
    type: Actions.CheckIsValid;
    targets: string[];
};

export type ValidationCheck = { failed: false } | { failed: true; inError: string[] };

export type ListItemsEvent = HasResourceTarget &
    HasBucketTarget & {
        type: Actions.GetResourceList;
        limit?: number;
        token?: string;
    };

export type ResourceListing = { items: string[]; token?: string };
export type AssetsEvent = SingleItemEvent | ListItemsEvent | CheckItemValidEvent;

export const DYNAMIC_ASSET_PATH_PREFIX = "_assets";
