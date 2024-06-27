import { useForm } from "react-hook-form";
import { UserType, paymentIntentResponse } from "../../shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  paymentIntent: paymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const search = useSearchContext();
  const { hotelId } = useParams();

  const { showToash } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToash({ message: "booking saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToash({ message: "error saving booking", type: "ERROR" });
      },
    }
  );

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-4"
    >
      <span className=" text-3xl fonot-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm fond-bold flex-1">
          First Name
          <input
            type="text"
            readOnly
            disabled
            {...register("firstName")}
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gay-200 font-normal"
          />
        </label>
        <label className="text-gray-700 text-sm fond-bold flex-1">
          last Name
          <input
            type="text"
            readOnly
            disabled
            {...register("lastName")}
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gay-200 font-normal"
          />
        </label>
        <label className="text-gray-700 text-sm fond-bold flex-1">
          Email
          <input
            type="text"
            readOnly
            disabled
            {...register("email")}
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gay-200 font-normal"
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">your Price Summary</h2>
      </div>

      <div className="bg-blue-200 p-4 rounded-md">
        <div className="font-semibold text-lg">
          Total Cost: ${paymentIntent.totalCost.toFixed(2)}
        </div>

        <div className="text-xs">Includes taxes and charges</div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-ml disabled:bg-gray-500"
        >
          {isLoading ? "saving.." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
