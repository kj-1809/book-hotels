import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";
import { prisma } from "~/server/db";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const hotelRouter = createTRPCRouter({
  addHotel: protectedProcedure
    .input(
      z.object({
        name: z.string().max(100).min(5),
        info: z.string().max(100).min(5),
        description: z.string().min(10).max(1000),
        price: z.number().min(500).max(10000000).multipleOf(10),
        rating: z.number().gte(1).lte(5).int(),
        amenities: z.array(
          z.object({
            title: z.string(),
          })
        ),
        imageUrls: z.array(
          z.object({
            url: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { success } = await ratelimit.limit(ctx.session.user.userId);

      console.log("success :", success);

      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      await prisma.hotel.create({
        data: {
          name: input.name,
          info: input.info,
          description: input.description,
          price: input.price,
          rating: input.rating,
          amenities: {
            connect: input.amenities,
          },
          imageUrls: {
            create: input.imageUrls,
          },
        },
      });
      return true;
    }),
  addAmenity: protectedProcedure
    .input(z.object({ title: z.string().min(2) }))
    .mutation(async ({ input, ctx }) => {
      console.log("shesh");
      console.log(ctx.session);
      console.log(ctx.session.user.userId);
      const { success } = await ratelimit.limit(ctx.session.user.userId);

      console.log("success : ", success);

      if (!success) {
        console.log("ending out")
        throw new TRPCError({code : "TOO_MANY_REQUESTS"});
      }

      try {
        await prisma.amenity.create({
          data: {
            title: input.title,
          },
        });
      } catch (e) {
        console.log("some error occured !", e);
      }
    }),
  search: publicProcedure.input(z.string()).query(async ({ input }) => {
    const data = await prisma.hotel.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input,
            },
          },
          {
            info: {
              contains: input,
            },
          },
        ],
      },
      include: {
        imageUrls: true,
      },
    });

    return data;
  }),
  fetchAmenities: publicProcedure.query(async () => {
    const amenities = await prisma.amenity.findMany();
    return amenities;
  }),
});
