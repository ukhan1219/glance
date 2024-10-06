import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { plaidRouter } from "./routers/plaid";
import { polygonRouter } from './routers/polygon';
import  geminiRouter  from  './routers/gemini';
// import { geminiCryptoRouter } from "./routers/geminiCrypto";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  gemini: geminiRouter, 
  plaid: plaidRouter,
  polygon: polygonRouter,
  // geminiCrypto: geminiCryptoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

