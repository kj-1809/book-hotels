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
          router.push("/")
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
    <div className="flex flex-col p-7">
      <h1 className="text-3xl font-bold">Add new Amenity</h1>
      <div className="flex flex-row mt-10 items-center">
        <h1 className = "font-medium text-lg">Name</h1>
        <input
          className="rounded-md border border-sky-100 px-2 w-72 h-10 ml-5"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>

      <div
        onClick={handleSubmit}
        className="flex w-32 justify-center rounded-xl bg-primary px-4 py-2 mt-10"
      >
        Submit
      </div>
    </div>
  );
};

export default AddAmenity;
