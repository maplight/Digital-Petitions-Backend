export type HasEmail = { email: string };
export type HasUserPoolId = { userPoolId: string };
export type EventCommon = HasEmail & HasUserPoolId;

export type NewUserEvent = EventCommon & {
    type: "new-user";
};

export type DeleteUserEvent = EventCommon & {
    type: "delete-user";
};

export type AdminLambdaEvent = { payload: NewUserEvent | DeleteUserEvent };

import type {
    AdminCreateUserCommand,
    AdminDeleteUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

export type CognitoCommand = AdminCreateUserCommand | AdminDeleteUserCommand | null;
