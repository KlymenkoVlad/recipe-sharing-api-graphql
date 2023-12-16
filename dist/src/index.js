import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { connect } from "mongoose";
import dotenv from "dotenv";
import { resolvers } from "./graphql/resolvers/index.js";
import { typeDefs } from "./graphql/typeDefs/index.js";
import { verifyToken } from "../utils/authUtils.js";
const context = async ({ req, res }) => {
    const token = req.headers.authorization || "";
    const user = await verifyToken(token);
    return { userId: user?.userId };
};
dotenv.config({ path: "./.env" });
const MONGO_URL = process.env.MONGO_URL || "";
connect(MONGO_URL, {})
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error(err);
});
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context,
});
console.log(`🚀  Server ready at: ${url}`);
