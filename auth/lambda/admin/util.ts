import type { AttributeType } from "@aws-sdk/client-cognito-identity-provider";
import { AccessGroupKeys } from "../common";
import type { User } from "./types";

export const allNonLetters = /[^a-zA-Z]/g;

export function emailToUserName(email: string): string {
    const normalizedEmail = email.toLowerCase().replace(/[@.#!]/g, "_");
    const dateSuffix = new Date().getTime().toString(16);

    return `${normalizedEmail}_${dateSuffix}`;
}

export function sanitizeIdentifier(value: string | undefined): string | undefined {
    return value?.trim()?.replace(allNonLetters, "");
}

export const standardToAppNameMapping: { [K: string]: keyof User } = {
    "given_name": "firstName",
    "family_name": "lastName",
    "email": "email",
    "username": "username",
    "custom:access_group": "permissions"
};

export function attributeListToUser(attributes: AttributeType[] | undefined): User {
    return (
        (attributes ?? [])
            .map(({ Name, Value }) => [standardToAppNameMapping[Name ?? ""], Value])
            .filter(([name, _]) => !!name) as [keyof User, string | undefined][]
    ).reduce((dict, [name, value]) => {
        if (name === "permissions") {
            dict.permissions = (value as AccessGroupKeys) ?? AccessGroupKeys.Petitioner;
        } else {
            dict[name] = value ?? "";
        }

        return dict;
    }, {} as User);
}
