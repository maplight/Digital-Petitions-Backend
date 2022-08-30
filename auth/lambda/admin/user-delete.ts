import {
    AdminDeleteUserCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import type { DeleteUserEvent } from "./types";

export async function handleDeleteUser(
    event: DeleteUserEvent,
    client: CognitoIdentityProviderClient
): Promise<void> {
    const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: event.userPoolId,
        Username: event.username
    });

    await client.send(deleteCommand);
}
