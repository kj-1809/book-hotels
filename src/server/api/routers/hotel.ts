import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { z } from "zod";
import { prisma } from "~/server/db";

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
      })
    )
    .mutation(async ({ input }) => {
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
        },
      });
      return true;
    }),
  addAmenity: protectedProcedure
    .input(z.object({ title: z.string().min(2) }))
    .mutation(async ({ input, ctx }) => {
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
    });

    return data;
  }),
  fetchAmenities : publicProcedure.query(async () => {
    const amenities = await prisma.amenity.findMany()
    return amenities;
  })
});
