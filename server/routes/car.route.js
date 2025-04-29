const router = require("express").Router();
const Car = require("../models/car.model");
const carController = require("../controllers/car.controller");

router.get("/getallcars", carController.getAllCars);
router.post("/addcar", carController.addCar);
router.post("/editcar", carController.editCar);
router.post("/deletecar", carController.deleteCar);
router.get("/getcar/:carId", carController.getCarById);



module.exports = router;


// router.get("/getcar/:carId", async (req, res) => {
//     try {
//       const car = await Car.findById(req.params.carId);
//       if (!car) {
//         return res.status(404).json({ message: "Car not found" });
//       }
//       res.json(car);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching car details" });
//     }
//   });
