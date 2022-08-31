import {
    AdminAddUserToGroupCommand,
    AdminCreateUserCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import { ACCESS_GROUP_ATTR, getGroups } from "../common";
import type { NewUserEvent } from "./types";
import { emailToUserName } from "./util";

const allNonLetters = /[^a-zA-Z]/g;

export async function handleCreateUser(event: NewUserEvent, client: CognitoIdentityProviderClient) {
    const username = emailToUserName(event.email);

    const attributes = [
        { Name: ACCESS_GROUP_ATTR, Value: event.permissions },
        { Name: "email_verified", Value: "True" },
        { Name: "email", Value: event.email }
    ];

    const firstName = event.firstName?.trim()?.replace(allNonLetters, "");

    if (firstName) {
        attributes.push({ Name: "given_name", Value: firstName });
    }

    const lastName = event.lastName?.trim()?.replace(allNonLetters, "");

    if (lastName) {
        attributes.push({ Name: "family_name", Value: lastName });
    }

    const createCommand = new AdminCreateUserCommand({
        UserPoolId: event.userPoolId,
        Username: username,
        DesiredDeliveryMediums: ["EMAIL"],
        UserAttributes: attributes
    });

    const results = await client.send(createCommand);

    if (!results.User) throw new Error("UserCreateFailed");

    const groups = await getGroups(event.userPoolId, client);

    const addToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: event.userPoolId,
        Username: results.User.Username,
        GroupName: groups[event.permissions]
    });

    await client.send(addToGroupCommand);

    return {
        firstName: event.firstName,
        lastName: event.lastName,
        permissions: event.permissions,
        email: event.email,
        username
    };
}
