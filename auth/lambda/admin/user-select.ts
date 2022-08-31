import type { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import type { SelectUserEvent } from "./types";

export async function handleSelectUser(
    event: SelectUserEvent,
    client: CognitoIdentityProviderClient
) {}
