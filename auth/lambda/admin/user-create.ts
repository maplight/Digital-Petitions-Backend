import {
    AdminAddUserToGroupCommand,
    AdminCreateUserCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import { ACCESS_GROUP_ATTR, getGroups } from "../common";
import type { NewUserEvent, Option, User } from "./types";
import { emailToUserName, sanitizeIdentifier } from "./util";

export async function handleCreateUser(
    event: NewUserEvent,
    client: CognitoIdentityProviderClient
): Promise<Option<User>> {
    const username = emailToUserName(event.email);

    const attributes = [
        { Name: ACCESS_GROUP_ATTR, Value: event.permissions },
        { Name: "email_verified", Value: "True" },
        { Name: "email", Value: event.email }
    ];

    const firstName = sanitizeIdentifier(event.firstName);

    if (firstName) {
        attributes.push({ Name: "given_name", Value: firstName });
    }

    const lastName = sanitizeIdentifier(event.lastName);

    if (lastName) {
        attributes.push({ Name: "family_name", Value: lastName });
    }

    const createCommand = new AdminCreateUserCommand({
        UserPoolId: event.userPoolId,
        Username: username,
        DesiredDeliveryMediums: ["EMAIL"],
        UserAttributes: attributes
    });

    try {
        await client.send(createCommand);

        const groups = await getGroups(event.userPoolId, client);

        const addToGroupCommand = new AdminAddUserToGroupCommand({
            UserPoolId: event.userPoolId,
            Username: username,
            GroupName: groups[event.permissions]
        });

        await client.send(addToGroupCommand);

        return {
            error: "None",
            data: {
                firstName: event.firstName,
                lastName: event.lastName,
                permissions: event.permissions,
                email: event.email,
                username
            }
        };
    } catch (err) {
        return { error: (err as Error)?.name ?? "UnknownError" };
    }
}
