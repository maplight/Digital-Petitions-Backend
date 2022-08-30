import {
    AdminCreateUserCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import type { NewUserEvent } from "./types";
import { emailToUserName } from "./util";

export async function handleNewUser(
    event: NewUserEvent,
    client: CognitoIdentityProviderClient
): Promise<void> {
    const command = new AdminCreateUserCommand({ UserPoolId: event.userPoolId, Username: emailToUserName(event.email) });
    const results = await client.send(command);

    if (!results.User) return;
}
