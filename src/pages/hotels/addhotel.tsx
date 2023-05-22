import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "~/server/uploadthing";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import "@uploadthing/react/styles.css";

const AddHotel = () => {
  const [selectedAmenity, setSelectedAmenity] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<
    { title: string }[]
  >([]);
  const [reload, setReload] = useState(0);
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [rating, setRating] = useState(0);
  const [imageUrls, setImageUrls] = useState<{ url: string }[]>([]);

  const router = useRouter();

  const submitMutation = api.hotel.addHotel.useMutation();
  const { data: amenities } = api.hotel.fetchAmenities.useQuery();

  useEffect(() => {
    if (selectedAmenity) {
      setSelectedAmenities((prevValue) => [
        ...prevValue,
        { title: selectedAmenity },
      ]);
      setReload(1 - reload);
    }
  }, [selectedAmenity]);

  function handleSubmit() {
    submitMutation.mutate(
      {
        name,
        description,
        info,
        price,
        rating,
        amenities: selectedAmenities,
        imageUrls,
      },
      {
        onSuccess: () => {
          toast.success("Added hotel successfully !");
          router.push("/");
        },
        onError: (e) => {
          console.log("error : ", e);
          console.log("zod error : ", e.data?.zodError?.fieldErrors);
          console.log("zod : ", e.data?.zodError?.formErrors.length);
          toast.error("Some error occured !");
        },
      }
    );
  }

  const handleUpload = async () => {};

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Add new Hotel</h1>
      <div className="mt-10 flex flex-row items-center">
        <h1>Name</h1>
        <input
          className="ml-5 h-10 w-72 rounded-md border border-sky-100 px-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <div className="mt-5 flex flex-row items-center">
        <h1>Info</h1>
        <input
          className="ml-5 h-10 w-72 rounded-md border border-sky-100 px-2"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        ></input>
      </div>
      <div className="mt-5 flex flex-row items-center">
        <h1>Description</h1>
        <input
          className="ml-5 h-10 w-72 rounded-md border border-sky-100 px-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
      </div>
      <div className="mt-5 flex flex-row items-center">
        <h1>Price</h1>
        <input
          className="ml-5 h-10 w-72 rounded-md border border-sky-100 px-2"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
          type="number"
        ></input>
      </div>
      <div className="mt-5 flex flex-row items-center">
        <h1>Rating</h1>
        <input
          className="ml-5 h-10 w-72 rounded-md border border-sky-100 px-2"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          type="number"
        ></input>
      </div>
      <div className="mt-5 flex flex-row items-center">
        <h1>Amenities</h1>
        <select
          name="amenities"
          id="amenityselector"
          value={selectedAmenity}
          onChange={(e) => {
            setSelectedAmenity(e.target.value);
          }}
          className="ml-5 h-10"
        >
          <option value="select">select</option>
          {amenities &&
            amenities.map((amenity) => (
              <option value={`${amenity.title}`} key={amenity.id}>
                {amenity.title}
              </option>
            ))}
        </select>
        <Link href="/hotels/addamenity">
          <div className=" ml-5 flex w-48 justify-center rounded-xl bg-primary px-4 py-2">
            Add Amenity
          </div>
        </Link>
      </div>
      {/* show the selected amenities */}
      {selectedAmenities.map((ele) => (
        <span className="pr-1" key={ele.title}>
          {ele.title}
        </span>
      ))}

      <div className="mt-10 bg-slate-500">
        <UploadButton<OurFileRouter>
          endpoint="imageUploader"
          multiple
          onClientUploadComplete={(res) => {
            console.log("res : ", res);
            if (res) {
              const addedUrls = res.map((file) => ({url : file.fileUrl}));
              setImageUrls(addedUrls)
            }
            alert("Upload Completed");
          }}
        />
      </div>
      <div
        onClick={handleSubmit}
        className="mt-10 flex w-32 justify-center rounded-xl bg-primary px-4 py-2"
      >
        Submit
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({ req: ctx.req, res: ctx.res });
  if (session?.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  return { props: {} };
};

export default AddHotel;
