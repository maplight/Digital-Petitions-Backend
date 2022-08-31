import type { AccessGroupKeys } from "../common";

export type HasEmail = { email: string };
export type HasUserPoolId = { userPoolId: string };
export type HasUserTarget = { username: string };

export type EventCommon = HasEmail & HasUserPoolId;

export type StaffAccessType = Exclude<AccessGroupKeys, AccessGroupKeys.Petitioner>;
export enum Actions {
    Create = "create-user",
    Delete = "delete-user"
}

export type NewUserInput = {
    firstName?: string;
    lastName?: string;
    permissions: StaffAccessType;
};

export type NewUserEvent = EventCommon & {
    type: Actions.Create;
} & NewUserInput;

export type DeleteUserEvent = HasUserPoolId & {
    type: Actions.Delete;
} & HasUserTarget;

export type AdminLambdaEvent = NewUserEvent | DeleteUserEvent;
