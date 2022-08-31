import {
    AdminDeleteUserCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import type { DeleteUserEvent, Option } from "./types";

export async function handleDeleteUser(
    event: DeleteUserEvent,
    client: CognitoIdentityProviderClient
): Promise<Option<void>> {
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
