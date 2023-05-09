import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const AddAmenity = () => {
  const [name, setName] = useState("");
  const addAmenityMutation = api.hotel.addAmenity.useMutation();
  const router = useRouter();
  function handleSubmit() {
    console.log("clicked");
    const data = addAmenityMutation.mutate(
      { title: name },
      {
        onSuccess: () => {
          toast.success("Successfully added amenity !");
          // router.push("/")
        },
        onError: (e) => {
          if (e.message === "TOO_MANY_REQUESTS") {
            toast.error("Too Many Requests! Please try again later!");
          } else {
            toast.error("Some error occured !");
          }
        },
      }
    );
    console.log(`data : ${data}`);
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Add new Amenity</h1>
      <div className="m-1 flex flex-row">
        <h1>Name</h1>
        <input
          className="rounded-xl border border-sky-100 px-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <div
          onClick={handleSubmit}
          className="flex w-32 justify-center rounded-xl bg-primary px-4 py-2"
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default AddAmenity;
