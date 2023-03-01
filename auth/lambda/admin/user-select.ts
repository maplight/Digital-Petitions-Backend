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

function applyEventFilter(user: User, event: SelectUserEvent): boolean {
  return (
    checkNames(user, event.searchName) && checkTypes(user, event.searchGroup)
  );
}

export async function handleSelectUser(
  event: SelectUserEvent,
  client: CognitoIdentityProviderClient
): Promise<Option<Connection<User>>> {
  event.searchName = sanitizeIdentifier(event.searchName);

  const clientSide = !!(event.searchName || event.searchGroup);
  const results: User[] = [];

  let lastToken: string | undefined = event.cursor;
  const pageLimit = event.limit ?? 10;

  let filter: string | undefined;

  if (event.searchEmail) {
    filter = `email = \"${event.searchEmail}\"`;
  }

  try {
    do {
      const input: ListUsersCommandInput = {
        UserPoolId: event.userPoolId,
        Filter: filter,
        PaginationToken: lastToken,
      };

      if (!clientSide) {
        input.Limit = pageLimit;
      }

      const command = new ListUsersCommand(input);
      const items = await client.send(command);

      lastToken = items.PaginationToken;

      const users =
        items.Users?.map((user) =>
          attributeListToUser(user.Username!, user.Attributes)
        ) ?? [];
      const match = clientSide
        ? users.filter((user) => applyEventFilter(user, event))
        : users;

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
