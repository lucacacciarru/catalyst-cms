import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mongoClientPromise from "./mongo";
import { NextApiRequest, NextApiResponse } from "next";

const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(mongoClientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      if (!user.email) return false;

      const client = await mongoClientPromise;

      const collection = client.db().collection("users");

      const doc = await collection.findOne({ email: user.email });

      if (!doc) {
        return false;
      }

      return true;
    },
  },
};

export function handleAuthRequest(req: NextApiRequest, res: NextApiResponse) {
  req.query.nextauth = req.query.catalyst!.slice(1)!;

  return NextAuth(req, res, authOptions);
}

export function isAuthRequest(req: NextApiRequest) {
  return req.url!.includes("auth");
}

export function createCatalystAuthObject() {
  return {
    getServerSession: () => getServerSession(authOptions),
  };
}
