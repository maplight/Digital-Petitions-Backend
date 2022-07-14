import type { Context } from "aws-lambda";
import type { Point } from "./common";

// export default <Handler<Pick<Point, "primary">, Point[]>>(
//     async (event, _context) => (
//         console.log(event), [{ primary: event.primary, sorting: "some-key" }]
//     )
// );

export default async function (event: Pick<Point, "primary">, _context: Context): Promise<Point[]> {
    console.log(event);

    return [{ ...event, sorting: "something" }];
}
