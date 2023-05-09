import { createTRPCRouter } from "~/server/api/trpc";
import { bookingRouter } from "./routers/booking";
import { hotelRouter } from "./routers/hotel";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  booking : bookingRouter,
  hotel : hotelRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
