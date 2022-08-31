import {
    AdminDeleteUserCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import type { DeleteUserEvent } from "./types";

export async function handleDeleteUser(
    event: DeleteUserEvent,
    client: CognitoIdentityProviderClient
) {
    const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: event.userPoolId,
        Username: event.username
    });

    try {
        await client.send(deleteCommand);
        return { error: "None" };
    } catch (err) {
        return { error: (err as Error)?.name ?? "UnknownError" };
    }
}
