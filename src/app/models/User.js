// user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema for reviews
const reviewSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewText: { type: String, required: true },
});

const watchlistItemSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true }, // movieTitle is a string
  movieYear: { type: Number, required: true },
  movieRating: { type: Number, required: true }  // movieRating is a number
});
// Schema for users
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteMovies: { type: [String] }, // Top 5 favorite movies
  favoriteFilmmakers: { type: [String] }, // Favorite filmmakers
  profilePicture: { type: String }, // Profile picture URL
  reviews: [reviewSchema], // Array of reviews associated with the user
  watchlist: [watchlistItemSchema] // Array of watchlist items
})
// Remove the password re-hashing since it's already handled in the signup route
userSchema.pre('save', async function (next) {
  console.log("pre func is being called");

  // Only hash the password if it's being modified (for example, during a password update)
  if (!this.isModified('password')) return next();

  // You can remove the hashing logic from here as it's already handled
  next();
});


const User = mongoose.model('User', userSchema);
module.exports = User;
