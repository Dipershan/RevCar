const mongoose = require("mongoose");
const Car = require("./models/car.model");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Location data for Nepal
const locationUpdates = [
  {
    name: "Tata Altroz",
    location: {
      city: "Mustang",
      state: "Gandaki",
      address: "Pokhara-Mustang Highway",
      coordinates: { latitude: 28.6955, longitude: 83.8477 }
    },
    type: "Sedan",
    transmission: "Manual",
    brand: "Tata",
    model: "Altroz",
    year: 2023,
    features: ["Air Conditioning", "Bluetooth", "USB Charging", "Backup Camera"]
  },
  {
    name: "Mahindra XUV700",
    location: {
      city: "Manang",
      state: "Gandaki",
      address: "Manang Valley",
      coordinates: { latitude: 28.6667, longitude: 84.0167 }
    },
    type: "SUV",
    transmission: "Automatic",
    brand: "Mahindra",
    model: "XUV700",
    year: 2023,
    features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Sunroof", "Cruise Control"]
  },
  {
    name: "Hyundai Creta",
    location: {
      city: "Dolpa",
      state: "Karnali",
      address: "Dolpa District Center",
      coordinates: { latitude: 28.9833, longitude: 82.8167 }
    },
    type: "SUV",
    transmission: "Manual",
    brand: "Hyundai",
    model: "Creta",
    year: 2022,
    features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Child Seat"]
  },
  {
    name: "Maruti Suzuki Swift",
    location: {
      city: "Pokhara",
      state: "Gandaki",
      address: "Lakeside Area",
      coordinates: { latitude: 28.2096, longitude: 83.9856 }
    },
    type: "Sedan",
    transmission: "Manual",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2023,
    features: ["Air Conditioning", "USB Charging"]
  },
  {
    name: "Scorpio S11",
    location: {
      city: "Kathmandu",
      state: "Bagmati",
      address: "Thamel Tourist Area",
      coordinates: { latitude: 27.7172, longitude: 85.3240 }
    },
    type: "SUV",
    transmission: "Manual",
    brand: "Mahindra",
    model: "Scorpio",
    year: 2022,
    features: ["Air Conditioning", "GPS Navigation", "WiFi Hotspot"]
  },
  {
    name: "Deepal- SL03",
    location: {
      city: "Lalitpur",
      state: "Bagmati",
      address: "Patan Durbar Square",
      coordinates: { latitude: 27.6731, longitude: 85.3240 }
    },
    type: "Electric",
    transmission: "Automatic",
    brand: "Deepal",
    model: "SL03",
    year: 2024,
    features: ["Air Conditioning", "GPS Navigation", "Premium Sound System", "WiFi Hotspot", "USB Charging"]
  },
  {
    name: "Toyota Fortuner",
    location: {
      city: "Bhaktapur",
      state: "Bagmati",
      address: "Bhaktapur Durbar Square",
      coordinates: { latitude: 27.6721, longitude: 85.4280 }
    },
    type: "Luxury",
    transmission: "Automatic",
    brand: "Toyota",
    model: "Fortuner",
    year: 2023,
    features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Sunroof", "Cruise Control", "Premium Sound System"]
  },
  {
    name: "Honda City",
    location: {
      city: "Mustang",
      state: "Gandaki",
      address: "Upper Mustang Trek Route",
      coordinates: { latitude: 28.6955, longitude: 83.8477 }
    },
    type: "Sedan",
    transmission: "Manual",
    brand: "Honda",
    model: "City",
    year: 2022,
    features: ["Air Conditioning", "Bluetooth", "Backup Camera"]
  },
  {
    name: "Nissan X-Trail",
    location: {
      city: "Manang",
      state: "Gandaki",
      address: "Annapurna Circuit",
      coordinates: { latitude: 28.6667, longitude: 84.0167 }
    },
    type: "SUV",
    transmission: "Automatic",
    brand: "Nissan",
    model: "X-Trail",
    year: 2023,
    features: ["Air Conditioning", "GPS Navigation", "Leather Seats", "Cruise Control"]
  },
  {
    name: "Suzuki Dzire",
    location: {
      city: "Dolpa",
      state: "Karnali",
      address: "Shey Phoksundo Lake Area",
      coordinates: { latitude: 28.9833, longitude: 82.8167 }
    },
    type: "Sedan",
    transmission: "Manual",
    brand: "Maruti Suzuki",
    model: "Dzire",
    year: 2023,
    features: ["Air Conditioning", "USB Charging"]
  }
];

const updateCarLocations = async () => {
  try {
    console.log("Starting location updates...");
    
    for (const update of locationUpdates) {
      const result = await Car.updateOne(
        { name: update.name },
        {
          $set: {
            location: update.location,
            type: update.type,
            transmission: update.transmission,
            brand: update.brand,
            model: update.model,
            year: update.year,
            features: update.features
          }
        }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${update.name} with location: ${update.location.city}, ${update.location.state}`);
      } else {
        console.log(`❌ Car not found: ${update.name}`);
      }
    }
    
    console.log("Location updates completed!");
    
    // Display summary
    const totalCars = await Car.countDocuments();
    const carsWithLocation = await Car.countDocuments({ 'location.city': { $exists: true } });
    
    console.log(`\n📊 Summary:`);
    console.log(`Total cars: ${totalCars}`);
    console.log(`Cars with location: ${carsWithLocation}`);
    console.log(`Cars without location: ${totalCars - carsWithLocation}`);
    
  } catch (error) {
    console.error("Error updating car locations:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateCarLocations(); 