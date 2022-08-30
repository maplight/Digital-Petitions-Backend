import type { Handler } from "aws-lambda";
import type { AdminLambdaEvent } from "./types";

import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import { handleCreateUser } from "./user-create";
import { handleDeleteUser } from "./user-delete";

const client = new CognitoIdentityProviderClient({});

export const handler: Handler<AdminLambdaEvent> = async (event): Promise<any> => {
    switch (event.payload.type) {
        case "new-user":
            await handleCreateUser(event.payload, client);
            break;

        case "delete-user":
            await handleDeleteUser(event.payload, client);
            break;

        default:
            console.log("Unsupported action requested");
    }
};
