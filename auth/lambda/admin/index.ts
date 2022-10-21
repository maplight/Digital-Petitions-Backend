import type { Handler } from "aws-lambda";
import { Actions, AdminLambdaEvent } from "./types";

import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import { handleCreateUser } from "./user-create";
import { handleDeleteUser } from "./user-delete";
import { handleSelectUser } from "./user-select";
import { handleUpdateUserAccess } from "./user-update-access";
import { handleResendCode } from "./user-resend-code";

const client = new CognitoIdentityProviderClient({});

export const handler: Handler<AdminLambdaEvent> = async (event): Promise<any> => {
    switch (event.type) {
        case Actions.Create:
            return await handleCreateUser(event, client);

        case Actions.Delete:
            return await handleDeleteUser(event, client);

        case Actions.Select:
            return await handleSelectUser(event, client);

        case Actions.UpdateAccess:
            return await handleUpdateUserAccess(event, client);

        case Actions.ResendCode:
            return await handleResendCode(event, client);

        default:
            console.log("Unsupported action requested");
    }
};
