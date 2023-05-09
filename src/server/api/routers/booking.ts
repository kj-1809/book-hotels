import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const bookingRouter = createTRPCRouter({
  createBooking: publicProcedure
    .input(
      z.object({
        checkIn: z.string(),
        checkOut: z.string(),
        guests: z.number(),
        rooms: z.number(),
        total: z.number(),
        hotelId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user) {
        return new TRPCError({ code: "UNAUTHORIZED" });
      }
      console.log("shesh")
      console.log(ctx.session)

      const { success } = await ratelimit.limit(ctx.session.user.userId);

      if(!success){
        return new TRPCError({code : "TOO_MANY_REQUESTS"})
      }

      const newBooking = await prisma.booking.create({
        data: {
          checkIn: new Date(input.checkIn),
          checkOut: new Date(input.checkOut),
          guests: input.guests,
          rooms: input.rooms,
          total: input.total,
          hotelId: input.hotelId,
          userId: input.userId,
        },
      });
      return newBooking;
    }),
});
