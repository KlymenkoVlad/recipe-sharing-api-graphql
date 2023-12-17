import { GraphQLError } from "graphql";
import { Context } from "vm";

export default function authMiddleware(context: Context) {
  if (!context.userId) {
    throw new GraphQLError("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}
