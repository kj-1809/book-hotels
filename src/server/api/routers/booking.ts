import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

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
    .mutation(async ({ input }) => {
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
