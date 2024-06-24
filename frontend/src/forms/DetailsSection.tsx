import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  return (
    <div className="flex  flex-col gap-4">
      <h1 className="text-3xl font-bold">Add Hotel</h1>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", { required: "this is required!" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message} </span>
        )}
      </label>
      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", { required: "this is required!" })}
          />
          {errors.city && (
            <span className="text-red-500">{errors.city.message} </span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", { required: "this is required!" })}
          />
          {errors.country && (
            <span className="text-red-500">{errors.country.message} </span>
          )}
        </label>
      </div>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Descrpition
        <textarea
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", { required: "this is required!" })}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message} </span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Price per Night
        <input
          type="number"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("pricePerNight", { required: "this is required!" })}
        />
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message} </span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Star Rating
        <select
          {...register("starRating", {
            required: "this is required!",
          })}
          className="border rouned w-full p-2 text-gray-700 fond-normal"
        >
          <option value="" className="test-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option value={num}>{num}</option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message} </span>
        )}
      </label>
    </div>
  );
};

export default DetailsSection;
