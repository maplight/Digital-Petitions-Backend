import type { AccessGroupKeys } from "../common";

export type HasEmail = { email: string };
export type HasUserPoolId = { userPoolId: string };
export type HasUserTarget = { username: string };
export type HasClientId = { clientId: string };

export type EventCommon = HasEmail & HasUserPoolId;

export type StaffAccessType = Exclude<AccessGroupKeys, AccessGroupKeys.Petitioner>;
export enum Actions {
    Create = "create-user",
    Delete = "delete-user",
    Select = "select-user",
    UpdateAccess = "update-user-access",
    ResendCode = "resend-code"
}

export type NewUserInput = {
    firstName?: string;
    lastName?: string;
    permissions: StaffAccessType;
};

export type Option<T> = { error: "None"; data: T } | { error: string };
export type Connection<T> = { token?: string; items: T[] };

export type User = {
    firstName?: string;
    lastName?: string;
    email: string;
    username: string;
    permissions: AccessGroupKeys;
};

export type NewUserEvent = EventCommon & {
    type: Actions.Create;
} & NewUserInput;

export type DeleteUserEvent = HasUserPoolId & {
    type: Actions.Delete;
} & HasUserTarget;

export type UpdateUserAccessEvent = HasUserPoolId & {
    type: Actions.UpdateAccess;
    permissions: AccessGroupKeys | "none";
} & HasUserTarget;

export type SelectUserEvent = HasUserPoolId & {
    type: Actions.Select;
    searchName?: string;
    searchEmail?: string;
    searchGroup?: StaffAccessType;
    cursor?: string;
    limit?: number;
};

export type ResendVerificationCodeEvent = HasUserPoolId & HasClientId & HasEmail & {
    type: Actions.ResendCode
}

export type AdminLambdaEvent =
    | NewUserEvent
    | DeleteUserEvent
    | SelectUserEvent
    | UpdateUserAccessEvent
    | ResendVerificationCodeEvent;
