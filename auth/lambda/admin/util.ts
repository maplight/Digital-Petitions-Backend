export const allNonLetters = /[^a-zA-Z]/g;

export function emailToUserName(email: string): string {
    const normalizedEmail = email.toLowerCase().replace(/[@.#!]/g, "_");
    const dateSuffix = new Date().getTime().toString(16);

    return `${normalizedEmail}_${dateSuffix}`;
}

export function sanitizeIdentifier(value: string | undefined): string | undefined {
    return value?.trim()?.replace(allNonLetters, "");
}
