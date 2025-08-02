import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from '../api/axiosInstance';

const BookingCar = () => {
  const { carid } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [car, setCar] = useState(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [paystackReady, setPaystackReady] = useState(false);
  const [driverRequired, setDriverRequired] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const publicKey = "pk_test_8c058c2afa628c71c71432cbaf0966a016ff38a7"; 
  const extraDriverFee = 5000; 

  // Check if car is available for booking
  const isCarAvailable = car?.availabilityStatus === "Available";

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
      if (!user) {
        alert("User not logged in");
        return;
      }

      // Double-check availability before processing booking
      if (!isCarAvailable) {
        alert("Sorry, this car is no longer available for booking.");
        navigate("/cars");
        return;
      }
  
      const today = new Date().toISOString().split('T')[0];
      const fullFromTime = `${today}T${fromTime}:00`;
      const fullToTime = `${today}T${toTime}:00`;
      
      const start = new Date(fullFromTime);
      const end = new Date(fullToTime);
      const totalHours = (end - start) / (1000 * 60 * 60);
      
      const bookingData = {
        car: car._id,
        bookedTimeSlots: {
          from: fullFromTime,
          to: fullToTime
        },
        totalHours,
        totalAmount: amount,
        transactionId: response.reference,
        driverRequired,
        status: "confirmed"
      };
      
      console.log("Booking data sending to backend:", bookingData);
      
      await axios.post("/api/bookings/add", bookingData);
      alert("Booking successful!");
      navigate("/bookings");
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      console.error("Full error:", error);
      alert(`Booking failed after payment: ${error.response?.data?.message || error.message}`);
    }
  };

  const handlePayment = () => {
    if (!paystackReady || !fromTime || !toTime || amount <= 0) {
      alert("Invalid booking details");
      return;
    }

    // Check availability before allowing payment
    if (!isCarAvailable) {
      alert("Sorry, this car is not available for booking.");
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

  const getHoursDifference = () => {
    if (!fromTime || !toTime) return 0;
    const start = new Date(`1970-01-01T${fromTime}`);
    const end = new Date(`1970-01-01T${toTime}`);
    return Math.ceil((end - start) / (1000 * 60 * 60));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400 border-t-transparent mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading your dream car...</div>
          <div className="text-blue-200 text-sm mt-2">Please wait while we fetch the details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Book Your Dream Ride
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Experience luxury and comfort with our premium car rental service
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Column - Car Showcase */}
          <div className="space-y-8">
            {/* Car Image Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="relative">
                {car?.image ? (
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={car.image}
                      alt={car.name || "Car"}
                      className={`w-full h-80 object-cover transition-all duration-700 ${
                        imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <i className="bi bi-car-front text-8xl text-white"></i>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition-transform ${
                    car?.availabilityStatus === "Available"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : car?.availabilityStatus === "In Service"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  }`}>
                    <i className={`bi ${
                      car?.availabilityStatus === "Available" ? "bi-check-circle" : 
                      car?.availabilityStatus === "In Service" ? "bi-tools" : "bi-x-circle"
                    } mr-2`}></i>
                    {car?.availabilityStatus || "Unknown"}
                  </span>
                </div>
              </div>
              
              {/* Car Title */}
              <div className="mt-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{car?.name || "Unnamed Car"}</h2>
                <p className="text-blue-200 text-lg">Premium Experience</p>
              </div>
            </div>

            {/* Car Specifications */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="bi bi-gear-wide-connected text-blue-400 mr-3"></i>
                Specifications
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <i className="bi bi-currency-rupee text-xl text-white"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 uppercase tracking-wide">Price per Hour</p>
                      <p className="text-2xl font-bold text-white">₹{car?.rentPerHour || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                      <i className="bi bi-people text-xl text-white"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 uppercase tracking-wide">Capacity</p>
                      <p className="text-2xl font-bold text-white">{car?.capacity || "N/A"} Seats</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                      <i className="bi bi-fuel-pump text-xl text-white"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 uppercase tracking-wide">Fuel Type</p>
                      <p className="text-2xl font-bold text-white">{car?.fuelType || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <i className="bi bi-shield-check text-xl text-white"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-200 uppercase tracking-wide">Status</p>
                      <p className="text-2xl font-bold text-white">{car?.availabilityStatus || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Records */}
            {car?.serviceRecords && car.serviceRecords.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <i className="bi bi-tools text-blue-400 mr-3"></i>
                  Service History
                </h3>
                <div className="space-y-3">
                  {car.serviceRecords.map((record, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transform hover:scale-105 transition-transform">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <i className="bi bi-check text-white text-sm"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-300">
                            <span className="font-semibold text-white">{record.date}:</span> {record.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="space-y-8">
            {/* Availability Warning */}
            {!isCarAvailable && (
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-2xl animate-pulse">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <i className="bi bi-exclamation-triangle text-2xl text-white"></i>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Car Not Available for Booking
                    </h3>
                    <p className="text-blue-200 mb-6">
                      This car is currently {car?.availabilityStatus?.toLowerCase()}. 
                      Please choose another car or check back later.
                    </p>
                    <button
                      onClick={() => navigate("/cars")}
                      className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                      <i className="bi bi-arrow-left mr-2"></i>
                      Browse Available Cars
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Form */}
            {isCarAvailable && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                  <i className="bi bi-calendar-check text-blue-400 mr-3"></i>
                  Book Your Ride
                </h3>

                <div className="space-y-8">
                  {/* Time Selection */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <i className="bi bi-clock text-blue-400 mr-2"></i>
                      Select Your Time
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          <i className="bi bi-play-circle text-green-400 mr-1"></i>
                          Pickup Time
                        </label>
                        <input
                          type="time"
                          value={fromTime}
                          onChange={(e) => setFromTime(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-blue-200 backdrop-blur-sm text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                          <i className="bi bi-stop-circle text-red-400 mr-1"></i>
                          Return Time
                        </label>
                        <input
                          type="time"
                          value={toTime}
                          onChange={(e) => setToTime(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-blue-200 backdrop-blur-sm text-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Driver Option */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform">
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={driverRequired}
                          onChange={handleDriverChange}
                          className="w-6 h-6 text-blue-500 border-white/30 rounded-lg focus:ring-blue-500 bg-white/10 transform hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-white">Include Professional Driver</span>
                          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full">+₹{extraDriverFee}</span>
                        </div>
                        <p className="text-sm text-blue-200 mt-1">Experienced driver for your convenience</p>
                      </div>
                    </label>
                  </div>

                  {/* Price Breakdown */}
                  {amount > 0 && (
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                      <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <i className="bi bi-calculator text-blue-400 mr-2"></i>
                        Price Breakdown
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-200">Base Rate ({getHoursDifference()} hours)</span>
                          <span className="font-semibold text-white text-lg">₹{amount - (driverRequired ? extraDriverFee : 0)}</span>
                        </div>
                        {driverRequired && (
                          <div className="flex justify-between items-center">
                            <span className="text-blue-200">Professional Driver</span>
                            <span className="font-semibold text-white text-lg">₹{extraDriverFee}</span>
                          </div>
                        )}
                        <div className="border-t border-white/20 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-white">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-400">₹{amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  {amount > 0 && (
                    <button
                      onClick={handlePayment}
                      disabled={!fromTime || !toTime}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                      <i className="bi bi-credit-card mr-3"></i>
                      Proceed to Payment
                    </button>
                  )}

                  {/* Booking Tips */}
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
                    <h4 className="font-semibold text-white mb-4 flex items-center text-lg">
                      <i className="bi bi-info-circle text-yellow-400 mr-2"></i>
                      Important Information
                    </h4>
                    <ul className="text-blue-200 space-y-2">
                      <li className="flex items-start">
                        <i className="bi bi-check-circle text-green-400 mr-2 mt-1"></i>
                        <span>Please arrive 10 minutes before your pickup time</span>
                      </li>
                      <li className="flex items-start">
                        <i className="bi bi-check-circle text-green-400 mr-2 mt-1"></i>
                        <span>Bring a valid ID and driving license</span>
                      </li>
                      <li className="flex items-start">
                        <i className="bi bi-check-circle text-green-400 mr-2 mt-1"></i>
                        <span>Return the car in the same condition</span>
                      </li>
                      <li className="flex items-start">
                        <i className="bi bi-check-circle text-green-400 mr-2 mt-1"></i>
                        <span>Fuel charges are included in the rental</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default BookingCar;