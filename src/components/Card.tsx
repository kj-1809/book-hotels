import Image from "next/image";
import testImage from "../../public/test.jpg";
import Link from "next/link";
interface Props {
  name: string;
  info: string;
  price: number;
  id: string;
  imgUrl: string;
}
export const Card: React.FC<Props> = ({ name, info, price, id, imgUrl }) => {
  return (
    <Link href={`/hotels/${id}`}>
      <div className="flex flex-col rounded-3xl shadow-2xl">
        <div className="relative h-72">
          <Image
            src={imgUrl}
            alt="hotel-img"
            className="rounded-t-3xl"
            fill
            style={{
              objectFit: "cover",
            }}
            /*placeholder="blur" blurDataURL={imgUrl}*/
          />
        </div>
        <div className="p-4">
          <h1>{name}</h1>
          <h1>{info}</h1>
          <h1 className="font-sans font-semibold">Rs. {price}</h1>
        </div>
      </div>
    </Link>
  );
};
