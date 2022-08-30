import type { Handler } from "aws-lambda";

import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import type { AdminLambdaEvent, CognitoCommand } from "./types";
import { handleNewUser } from "./add-user.handler";

const client = new CognitoIdentityProviderClient({});

export const handler: Handler<AdminLambdaEvent> = async (event): Promise<any> => {
    let command: CognitoCommand;

    switch (event.payload.type) {
        case "new-user":
            await handleNewUser(event.payload, client);
            break;

        default:
            command = null;
    }
};
