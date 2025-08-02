const mongoose = require("mongoose");
const Car = require("./models/car.model");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  const cars = [
    {
      name: "Tata Altroz",
      image: "https://img.gaadicdn.com/images/car-images/large/Tata/Altroz/10707/1706785701598/223_Arcade-Grey_323333.jpg",
      capacity: 5,
      fuelType: "Petrol",
      rentPerHour: 500,
      type: "Sedan",
      transmission: "Manual",
      brand: "Tata",
      model: "Altroz",
      year: 2023,
      features: ["Air Conditioning", "Bluetooth", "USB Charging", "Backup Camera"],
      location: {
        city: "Mustang",
        state: "Gandaki",
        address: "Pokhara-Mustang Highway",
        coordinates: { latitude: 28.6955, longitude: 83.8477 }
      },
      bookedTimeSlots: [{ from: "2024-02-18T10:00:00", to: "2024-02-18T14:00:00" }],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-11-10", description: "Oil change and tire rotation", cost: 2800 },
        { serviceDate: "2024-02-15", description: "Brake pad replacement", cost: 4500 }
      ]
    },
    {
      name: "Mahindra XUV700",
      image: "https://www.agnimahindra.com/assets/img/blue.jpg",
      capacity: 7,
      fuelType: "Diesel",
      rentPerHour: 600,
      type: "SUV",
      transmission: "Automatic",
      brand: "Mahindra",
      model: "XUV700",
      year: 2023,
      features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Sunroof", "Cruise Control"],
      location: {
        city: "Manang",
        state: "Gandaki",
        address: "Manang Valley",
        coordinates: { latitude: 28.6667, longitude: 84.0167 }
      },
      bookedTimeSlots: [{ from: "2024-02-19T12:00:00", to: "2024-02-19T16:00:00" }],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-10-05", description: "Engine oil replacement", cost: 3500 },
        { serviceDate: "2024-01-20", description: "Air filter change", cost: 1200 }
      ]
    },
    {
      name: "Hyundai Creta",
      image: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/201910/New_Creta_0.png?size=690:388",
      capacity: 5,
      fuelType: "Petrol",
      rentPerHour: 550,
      type: "SUV",
      transmission: "Manual",
      brand: "Hyundai",
      model: "Creta",
      year: 2022,
      features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Child Seat"],
      location: {
        city: "Dolpa",
        state: "Karnali",
        address: "Dolpa District Center",
        coordinates: { latitude: 28.9833, longitude: 82.8167 }
      },
      bookedTimeSlots: [],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-09-15", description: "Battery replacement", cost: 6000 },
        { serviceDate: "2024-02-10", description: "Coolant refill", cost: 1000 }
      ]
    },
    {
      name: "Maruti Suzuki Swift",
      image: "https://shivamautozone.com/wp-content/uploads/2024/05/Swift-8-768x433.webp",
      capacity: 5,
      fuelType: "Petrol",
      rentPerHour: 550,
      type: "Sedan",
      transmission: "Manual",
      brand: "Maruti Suzuki",
      model: "Swift",
      year: 2023,
      features: ["Air Conditioning", "USB Charging"],
      location: {
        city: "Pokhara",
        state: "Gandaki",
        address: "Lakeside Area",
        coordinates: { latitude: 28.2096, longitude: 83.9856 }
      },
      bookedTimeSlots: [],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-08-20", description: "Tire alignment and balancing", cost: 2000 },
        { serviceDate: "2024-01-12", description: "Brake inspection", cost: 1600 }
      ]
    },
    {
      name: "Scorpio S11",
      image: "https://imgd.aeplcdn.com/1056x594/n/q2tasra_1425655.jpg?q=80",
      capacity: 5,
      fuelType: "Petrol",
      rentPerHour: 550,
      type: "SUV",
      transmission: "Manual",
      brand: "Mahindra",
      model: "Scorpio",
      year: 2022,
      features: ["Air Conditioning", "GPS Navigation", "WiFi Hotspot"],
      location: {
        city: "Kathmandu",
        state: "Bagmati",
        address: "Thamel Tourist Area",
        coordinates: { latitude: 27.7172, longitude: 85.3240 }
      },
      bookedTimeSlots: [],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-07-25", description: "Suspension check", cost: 3200 },
        { serviceDate: "2024-01-30", description: "Oil and filter change", cost: 2700 }
      ]
    },
    {
      name: "Deepal- SL03",
      image: "https://techlekh.com/wp-content/uploads/2023/11/Deepal-SL03.jpg",
      capacity: 7,
      fuelType: "Electric",
      rentPerHour: 2000,
      type: "Electric",
      transmission: "Automatic",
      brand: "Deepal",
      model: "SL03",
      year: 2024,
      features: ["Air Conditioning", "GPS Navigation", "Premium Sound System", "WiFi Hotspot", "USB Charging"],
      location: {
        city: "Lalitpur",
        state: "Bagmati",
        address: "Patan Durbar Square",
        coordinates: { latitude: 27.6731, longitude: 85.3240 }
      },
      bookedTimeSlots: [{ from: "2024-02-19T12:00:00", to: "2024-02-19T16:00:00" }],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-09-05", description: "Battery health check", cost: 5000 },
        { serviceDate: "2024-03-01", description: "Software update", cost: 0 }
      ]
    },
    {
      name: "Toyota Fortuner",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW69pevV3p538Wc-NTPovdUnXwcONd4qscrw&s",
      capacity: 7,
      fuelType: "Diesel",
      rentPerHour: 800,
      type: "Luxury",
      transmission: "Automatic",
      brand: "Toyota",
      model: "Fortuner",
      year: 2023,
      features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Sunroof", "Cruise Control", "Premium Sound System"],
      location: {
        city: "Bhaktapur",
        state: "Bagmati",
        address: "Bhaktapur Durbar Square",
        coordinates: { latitude: 27.6721, longitude: 85.4280 }
      },
      bookedTimeSlots: [{ from: "2024-02-20T10:00:00", to: "2024-02-20T14:00:00" }],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-10-12", description: "Engine diagnostics", cost: 4000 },
        { serviceDate: "2024-02-05", description: "Brake oil replacement", cost: 1800 }
      ]
    },
    {
      name: "Honda City",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/city-exterior-right-front-three-quarter-148.jpeg",
      capacity: 5,
      fuelType: "Petrol",
      rentPerHour: 450,
      type: "Sedan",
      transmission: "Manual",
      brand: "Honda",
      model: "City",
      year: 2022,
      features: ["Air Conditioning", "Bluetooth", "Backup Camera"],
      location: {
        city: "Mustang",
        state: "Gandaki",
        address: "Upper Mustang Trek Route",
        coordinates: { latitude: 28.6955, longitude: 83.8477 }
      },
      bookedTimeSlots: [],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-12-01", description: "Regular maintenance", cost: 2500 },
        { serviceDate: "2024-01-15", description: "Tire replacement", cost: 8000 }
      ]
    },
    {
      name: "Nissan X-Trail",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/x-trail-exterior-right-front-three-quarter-148.jpeg",
      capacity: 5,
      fuelType: "Diesel",
      rentPerHour: 700,
      type: "SUV",
      transmission: "Automatic",
      brand: "Nissan",
      model: "X-Trail",
      year: 2023,
      features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Cruise Control"],
      location: {
        city: "Manang",
        state: "Gandaki",
        address: "Annapurna Circuit",
        coordinates: { latitude: 28.6667, longitude: 84.0167 }
      },
      bookedTimeSlots: [],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-11-20", description: "Engine tune-up", cost: 3500 },
        { serviceDate: "2024-02-01", description: "Brake system check", cost: 2200 }
      ]
    },
    {
      name: "Suzuki Dzire",
      image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/dzire-exterior-right-front-three-quarter-148.jpeg",
      capacity: 5,
      fuelType: "Petrol",
      rentPerHour: 400,
      type: "Sedan",
      transmission: "Manual",
      brand: "Maruti Suzuki",
      model: "Dzire",
      year: 2023,
      features: ["Air Conditioning", "USB Charging"],
      location: {
        city: "Dolpa",
        state: "Karnali",
        address: "Shey Phoksundo Lake Area",
        coordinates: { latitude: 28.9833, longitude: 82.8167 }
      },
      bookedTimeSlots: [],
      availabilityStatus: "Available",
      serviceRecords: [
        { serviceDate: "2023-10-05", description: "Oil change", cost: 1800 },
        { serviceDate: "2024-01-25", description: "Filter replacement", cost: 1200 }
      ]
    }
  ];
  


const insertCars = async () => {
  try {
      await Car.deleteMany(); 
      await Car.insertMany(cars); 
      console.log("Cars Inserted Successfully!");
      mongoose.connection.close();
  } catch (error) {
      console.error("Error Inserting Cars:", error);
      mongoose.connection.close();
  }
};

insertCars();