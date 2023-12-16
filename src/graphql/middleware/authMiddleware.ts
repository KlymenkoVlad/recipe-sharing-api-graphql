import { GraphQLError } from "graphql";

export default function authMiddleware(context) {
  if (!context.userId) {
    throw new GraphQLError("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}
