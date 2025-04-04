// routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// Add to wishlist
router.post("/add", wishlistController.addToWishlist);

// Get all wishlists (for admin)
router.get("/", wishlistController.getAllWishlists);

// Admin updates availability
router.post("/update-status", wishlistController.updateWishlistStatus);

module.exports = router;
