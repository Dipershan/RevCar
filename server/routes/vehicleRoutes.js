const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicle);

// Protected routes (admin only)
router.post('/', protect, adminOnly, vehicleController.createVehicle);
router.put('/:id', protect, adminOnly, vehicleController.updateVehicle);
router.delete('/:id', protect, adminOnly, vehicleController.deleteVehicle);
router.put('/:id/condition', protect, adminOnly, vehicleController.updateVehicleCondition);
router.post('/:id/service', protect, adminOnly, vehicleController.addServiceRecord);

module.exports = router; 