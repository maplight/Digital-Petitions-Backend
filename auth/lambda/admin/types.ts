export type HasEmail = { email: string };
export type HasUserPoolId = { userPoolId: string };
export type HasUserTarget = { username: string };

export type EventCommon = HasEmail & HasUserPoolId;

export type StaffAccessType = Exclude<AccessGroupKeys, "petitioner">;

export type NewUserInput = {
    firstName?: string;
    lastName?: string;
    permissions: StaffAccessType;
} & HasEmail;

export type NewUserEvent = EventCommon & {
    type: "new-user";
} & NewUserInput;

export type DeleteUserEvent = HasUserPoolId & {
    type: "delete-user";
} & HasUserTarget;

export type AdminLambdaEvent = { payload: NewUserEvent | DeleteUserEvent };

import type {
    AdminCreateUserCommand,
    AdminDeleteUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import type { AccessGroupKeys } from "../common";

export type CognitoCommand = AdminCreateUserCommand | AdminDeleteUserCommand | null;
