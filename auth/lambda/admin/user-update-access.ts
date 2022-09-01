import type { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import type { UpdateUserAccessEvent, User, Option } from "./types";

export async function handleUpdateUserAccess(
    event: UpdateUserAccessEvent,
    client: CognitoIdentityProviderClient
): Promise<Option<User>> {
    return { error: "None" };
}
