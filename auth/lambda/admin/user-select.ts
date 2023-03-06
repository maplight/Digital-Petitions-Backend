import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import type { AccessGroupKeys } from "../common";
import type { SelectUserEvent, User, Option, Connection } from "./types";
import { attributeListToUser, sanitizeIdentifier } from "./util";

function checkNames(user: User, name?: string): boolean {
  return (
    (!name ||
      user.firstName?.toLocaleLowerCase().includes(name.toLowerCase()) ||
      user.lastName?.toLocaleLowerCase().includes(name.toLowerCase())) ??
    false
  );
}

function checkTypes(user: User, type?: AccessGroupKeys): boolean {
  return !type || user.permissions === type;
}

function checkEmail(user: User, email?: string): boolean {
  return !email || user.email.toLowerCase().includes(email.toLowerCase());
}

function applyEventFilter(user: User, event: SelectUserEvent): boolean {
  return (
    checkNames(user, event.searchName) && 
    checkTypes(user, event.searchGroup) &&
    checkEmail(user, event.searchEmail)
  );
}

export async function handleSelectUser(
  event: SelectUserEvent,
  client: CognitoIdentityProviderClient
): Promise<Option<Connection<User>>> {
  event.searchName = sanitizeIdentifier(event.searchName);

  const results: User[] = [];

  let lastToken: string | undefined = event.cursor;
  const pageLimit = event.limit ?? 10;

  try {
    do {
      const input: ListUsersCommandInput = {
        UserPoolId: event.userPoolId,
        PaginationToken: lastToken,
      };

      const command = new ListUsersCommand(input);
      const items = await client.send(command);

      lastToken = items.PaginationToken;

      const users =
        items.Users?.map((user) =>
          attributeListToUser(user.Username!, user.Attributes)
        ) ?? [];

      const match = users.filter((user) => applyEventFilter(user, event))

      results.push(...match);
    } while (lastToken && results.length < pageLimit);

    return {
      error: "None",
      data: { items: results.slice(0, pageLimit), token: lastToken },
    };
  } catch (err) {
    return { error: (err as Error)?.name };
  }
}
