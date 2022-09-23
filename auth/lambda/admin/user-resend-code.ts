import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    ResendConfirmationCodeCommand,
    UserType
} from "@aws-sdk/client-cognito-identity-provider";
import type { Option, ResendVerificationCodeEvent } from "./types";

export async function handleResendCode(
    event: ResendVerificationCodeEvent,
    client: CognitoIdentityProviderClient
): Promise<Option<boolean>> {
    try {
        const listCommand = new ListUsersCommand({
            UserPoolId: event.userPoolId,
            Filter: `email = \"${event.email}\"`
        });

        const items: UserType[] = (await client.send(listCommand))?.Users ?? [];

        if (!items.length) return { error: "NotFound" };

        const target = items.find((user) =>
            ["UNCONFIRMED", "RESET_REQUIRED"].includes(user.UserStatus ?? "")
        );

        if (!target) return { error: "NotFound" };

        const resendCodeCommand = new ResendConfirmationCodeCommand({
            ClientId: event.clientId,
            Username: target.Username
        });

        await client.send(resendCodeCommand);

        return { error: "None", data: true };
    } catch (err) {
        return { error: (err as Error)?.name };
    }
}
