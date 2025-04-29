import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const BookingCar = () => {
  const { carid } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [paystackReady, setPaystackReady] = useState(false);
  const [driverRequired, setDriverRequired] = useState(false);

  const publicKey = "pk_test_8c058c2afa628c71c71432cbaf0966a016ff38a7"; 
  const extraDriverFee = 5000; 

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`/api/cars/getcar/${carid}`);
        console.log("Car data:", data);
        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carid]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackReady(true);
    script.onerror = () => console.error("Failed to load Paystack script");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!fromTime || !toTime || !car) return;

    const start = new Date(`1970-01-01T${fromTime}`);
    const end = new Date(`1970-01-01T${toTime}`);
    const diffHours = (end - start) / (1000 * 60 * 60);

    let baseAmount = diffHours > 0 ? diffHours * car.rentPerHour : 0;
    if (driverRequired) baseAmount += extraDriverFee;
    setAmount(baseAmount);
  }, [fromTime, toTime, car, driverRequired]);

  const handleDriverChange = () => {
    setDriverRequired(!driverRequired);
  };

  const handlePaymentSuccess = async (response) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("User not logged in");
        return;
      }
  
      const today = new Date().toISOString().split('T')[0];
      const fullFromTime = `${today}T${fromTime}:00`;
      const fullToTime = `${today}T${toTime}:00`;
      
      const start = new Date(fullFromTime);
      const end = new Date(fullToTime);
      const totalHours = (end - start) / (1000 * 60 * 60);
      
      const bookingData = {
        userId: user._id || user.id,
        carId: car._id,
        fromTime: fullFromTime,
        toTime: fullToTime,
        totalHours,
        transactionId: response.reference,
        totalAmount: amount,
        driverRequired,
      };
      
      console.log("Booking data sending to backend:", bookingData);
      
      await axios.post("/api/bookings/add", bookingData);
      alert("Booking successful!");
      navigate("/");
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      alert("Booking failed after payment.");
    }
  };

  const handlePayment = () => {
    if (!paystackReady || !fromTime || !toTime || amount <= 0) {
      alert("Invalid booking details");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: "dipershan.tukilogic@gmail.com",
      amount: Math.round(amount * 100),
      currency: "NGN",
      callback: (response) => {
        handlePaymentSuccess(response);
      },
      onClose: function () {
        alert("Payment window closed");
      },
    });

    handler.openIframe();
  };

  if (loading) return <p className="text-center mt-8">Loading car details...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex justify-center">
          {car?.image ? (
            <img
              src={car.image}
              alt={car.name || "Car"}
              className="rounded-lg shadow-lg w-full max-w-md object-cover"
            />
          ) : (
            <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{car?.name || "Unnamed Car"}</h1>
            <p className="text-gray-600 text-lg">₹{car?.rentPerHour || 0} Rent Per Hour</p>
            <div className="mt-2">
            <span className={`badge-animate inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              car?.availabilityStatus === "Available"
                ? "bg-green-200 text-green-800"
                : car?.availabilityStatus === "In Service"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}>{car?.availabilityStatus || "Unknown"}</span>

          </div>
            <p className="text-gray-500 mt-2">Fuel Type: {car?.fuelType || "Not Specified"}</p>
            <p className="text-gray-500">Max Persons: {car?.capacity || "N/A"}</p>
            <p className="text-gray-500">Availability Status: {car?.availabilityStatus || "Unknown"}</p>
          </div>

          {car?.serviceRecords && car.serviceRecords.length > 0 && (
          <div className="border-t pt-4">
          <h2 className="text-2xl font-semibold mb-4">Service Records</h2>
          {car?.serviceRecords && car.serviceRecords.length > 0 ? (
            <ul className="list-disc pl-6 space-y-2">
              {car.serviceRecords.map((record, index) => (
                <li key={index} className="text-gray-600">
                  <span className="font-medium">{record.date}:</span> {record.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No service records available.</p>
          )}
        </div>
 
          )}

          <div className="border-t pt-4">
            <h2 className="text-2xl font-semibold mb-4">Select Time Slots</h2>
            <div className="flex flex-col gap-4">
              <input
                type="time"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="time"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={driverRequired}
                onChange={handleDriverChange}
                className="accent-green-600"
              />
              <span className="text-lg">Driver Required (+₹{extraDriverFee})</span>
            </label>
          </div>

          {amount > 0 && (
            <div className="text-center mt-6">
              <p className="text-xl font-semibold mb-4">Total Amount: ₹{amount}</p>
              <button
                onClick={handlePayment}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition transform hover:scale-105"
              >
                Pay with Paystack
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCar;
