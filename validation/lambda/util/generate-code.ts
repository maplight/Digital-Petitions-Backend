import { rando } from "@nastyox/rando.js";
import { BASE_36X4_HI, BASE_36X4_LO } from "./constants";

function generateSegment(): string {
    return (rando(BASE_36X4_LO, BASE_36X4_HI) as number).toString(36).toUpperCase();
}

/**
 * Generate a code to be used as confirmation for signature verification
 * in cases where the signature cannot be immediately verified.
 *
 * @returns a randomly generated code
 */
export async function generateCode(): Promise<string> {
    const p1 = generateSegment();
    const p2 = generateSegment();
    const p3 = generateSegment();
    const p4 = generateSegment();

    return `${p1}-${p2}-${p3}-${p4}`;
}
