import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const createdHotel = await prisma.hotel.create({
        data: {
          name: "Radisson Heritage.",
          description:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae quidem iusto eius voluptatibus fugit ipsam praesentium blanditiis, omnis, deleniti id delectus in ad fugiat reprehenderit unde totam consequuntur officiis, alias eveniet quas aliquam. Recusandae omnis, veritatis sapiente consequatur vero vel cumque, sequi aut et temporibus fugit voluptate qui excepturi voluptatibus expedita iste. Distinctio voluptatem dolorum sequi repellat impedit ipsam adipisci, iure ab quisquam error dicta atque sunt consequuntur ipsa esse debitis pariatur! Reprehenderit quod libero fugit praesentium earum quaerat possimus?",
          info: "Beautiful hotel located in the hills on Norweigen Alps",
          price: 50000,
          rating: 5,
          amenities : {
            create : {
              title : "Some random Amenity"
            }
          }
        },
      });
      return res.status(200).json({ result: "success", createdHotel });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ result: "fail", reason: "Some internal server error !" });
    }
  }
}
