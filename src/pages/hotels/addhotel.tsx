import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

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

  const submitMutation = api.hotel.addHotel.useMutation();
  console.log(selectedAmenities);

  const router = useRouter();

  const {data : amenities} = api.hotel.fetchAmenities.useQuery();

  useEffect(() => {
    if (selectedAmenity) {
      selectedAmenities.push({ title: selectedAmenity });
      setReload(1 - reload);
    }
  }, [selectedAmenity]);

  function handleSubmit() {
    console.log("clicked");
    submitMutation.mutate(
      {
        name,
        description,
        info,
        price,
        rating,
        amenities: selectedAmenities,
      },
      {
        onSuccess: () => {
          toast.success("Added hotel successfully !");
          router.push("/");
        },
        onError: (e) => {
          console.log("error : ", e);
          toast.error("Some error occured !");
        },
      }
    );
  }

  console.log(selectedAmenity);
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Add new Hotel</h1>
      <div className="m-1 flex flex-row">
        <h1>Name</h1>
        <input
          className="rounded-xl border border-sky-100 px-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <div className="m-1 flex flex-row">
        <h1>Info</h1>
        <input
          className="rounded-xl border border-sky-100 px-2"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        ></input>
      </div>
      <div className="m-1 flex flex-row">
        <h1>Description</h1>
        <input
          className="rounded-xl border border-sky-100 px-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
      </div>
      <div className="m-1 flex flex-row">
        <h1>Price</h1>
        <input
          className="rounded-xl border border-sky-100 px-2"
          value={price}
          onChange={(e) => setPrice(parseInt(e.target.value))}
        ></input>
      </div>
      <div className="m-1 flex flex-row">
        <h1>Rating</h1>
        <input
          className="rounded-xl border border-sky-100 px-2"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
        ></input>
      </div>
      <div className="m-1 flex flex-row">
        <h1>Amenities</h1>
        <select
          name="amenities"
          id="amenityselector"
          value={selectedAmenity}
          onChange={(e) => {
            setSelectedAmenity(e.target.value);
          }}
        >
          <option value="select">select</option>
          {amenities && amenities.map((amenity) => (
            <option value={`${amenity.title}`} key={amenity.id}>{amenity.title}</option>
          ))}
        </select>
      </div>
      {selectedAmenities.map((ele) => (
        <span className="pr-1" key={ele.title}>
          {ele.title}
        </span>
      ))}
      <div
        onClick={handleSubmit}
        className="flex w-32 justify-center rounded-xl bg-primary px-4 py-2"
      >
        Submit
      </div>
    </div>
  );
};

export default AddHotel;
