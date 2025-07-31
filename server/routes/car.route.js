const router = require("express").Router();
const carController = require("../controllers/car.controller");
const { authenticateUser, requireAdmin } = require("../middlewares/authenticateUser");

// Public route for getting all cars (no authentication required)
router.get("/getallcars", carController.getAllCars);

//admin
router.post("/addcar", authenticateUser, requireAdmin, carController.addCar);
router.post("/editcar", authenticateUser, requireAdmin, carController.editCar);
router.post("/deletecar", authenticateUser, requireAdmin, carController.deleteCar);

router.get("/getcar/:carId", authenticateUser, carController.getCarById);

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
