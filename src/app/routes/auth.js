const express = require('express');
const bcrypt = require('bcrypt'); // To hash passwords and verify them
const User = require('../models/User'); // Adjust the path if necessary


const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    console.log('Received signup request:', req.body);  // Log request data
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // More logging for debugging
    console.log('Signup fields:', { name, email, password });
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Name:', name);
console.log('Email:', email);
console.log('Hashed Password:', hashedPassword); // Log the hashed password
const newUser = new User({ name, email, password: hashedPassword });
await newUser.save();
;
  
    console.log('New user created:', newUser);
    res.status(201).json({ message: 'User created successfully!' });
  });
  
// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find user by email
      const user = await User.findOne({ email });
      console.log('Stored hashed password:', user?.password); // Check what is stored in DB

      if (!user) {
          // If user not found, return 401 Unauthorized
          return res.status(401).json({ message: 'user not found' });
      }

      // Compare password with the hashed password in the database
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      console.log('Password is correct:', isPasswordCorrect); // For debugging

      if (!isPasswordCorrect) {
          // If password does not match, return 401 Unauthorized
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      // If login successful, return user information
      res.status(200).json({
          message: 'Login successful!',
          user: {
              id: user._id,
              email: user.email,
              name: user.name
          }
      });
  } catch (error) {
      // If server error occurs, return 500 Internal Server Error
      console.error('Server error:', error.message); // For debugging
      res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Submit Review Route (Using embedded reviews in User model)
router.post('/reviews', async (req, res) => {
    const { userId, movieTitle, rating, reviewText } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add new review to user's reviews array
        user.reviews.push({ movieTitle, rating, reviewText });
        await user.save(); // Save the user with the new review

        res.status(201).json({ message: 'Review submitted successfully!' }); // Ensure you return a JSON response
      } catch (error) {
          res.status(400).json({ message: 'Error submitting review: ' + error.message });
      }
});

// Fetch reviews for a specific user
router.get('/reviews/:userId', async (req, res) => {
  console.log(req.params);
  
    const { userId } = req.params;
    console.log(userId);
    

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.reviews); // Return user's reviews
    } catch (error) {
        res.status(400).send('Error fetching reviews: ' + error.message);
    }
});

// auth.js

// Update profile route (using userId from the request body)
router.put('/profile/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedProfileData = req.body;
  console.log('Received PUT request for user:', req.params.userId);
  console.log('Request body:', req.body);

  try {
    const user = await User.findByIdAndUpdate(userId, updatedProfileData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

router.get('/reviewsbyothers', async (req, res) => {
  try {
      const users = await User.find({}, 'name reviews profilePicture'); // Fetch users with their names and reviews
      const reviews = users.map(user => ({
          userId: user._id,
          userName: user.name,
          reviews: user.reviews, // This includes an array of reviews
          profilePicture: user.profilePicture
      }));

      // Return the array of users with their reviews
      res.status(200).json(reviews);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews: ' + error.message });
  }
});

// In your Express.js backend (Node.js)
router.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  // Fetch the user's profile data from the database using the userId
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send(user); // Send the user data
    })
    .catch(err => {
      res.status(500).send({ message: 'Error fetching user profile', error: err });
    });
});

//watchlist

// POST /api/users/:userId/watchlist
router.post('/watchlist/:userId', async (req, res) => {


const { movieTitle,movieYear, movieRating } = req.body; // Directly destructure from req.body
const userId = req.params.userId; // userId comes from route params

// Log incoming data for debugging
console.log('Request Body:', req.body);

// Check if userId is provided
if (!userId) {
  return res.status(400).send('User ID is required');
}

try {
  const user = await User.findById(userId);
  if (!user) return res.status(404).send('User not found');

  // Check if movieId is provided
  if (!movieTitle) {
    return res.status(400).send('Movie title is required');
  }

  // Create a watchlist item
  const watchlistItem = {
    // Ensure movieId is a number
    movieTitle: movieTitle,
    movieYear: Number(movieYear),
    movieRating: Number(movieRating) // Ensure movieRating is a number
  };

  // Check if the movie is already in the watchlist
  const isMovieInWatchlist = user.watchlist.some(item => item.movieTitle === watchlistItem.movieTitle);
  
   if (!isMovieInWatchlist) {
    user.watchlist.push(watchlistItem); // Push the watchlist item object
    await user.save();
    return res.status(200).json({ message: 'Movie added to watchlist' });
  } else {
    return res.status(400).json({ message: 'Movie already in watchlist' });
  }
  
} catch (error) {
  console.error('Error adding to watchlist:', error);
  return res.status(500).send('Server error');
}
})





// GET /api/users/:userId/watchlist
// Example Express route for getting a user's watchlist
router.get('/watchlist/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    return res.status(200).json(user.watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return res.status(500).send('Server error');
  }
});

// Route to delete a movie from the user's watchlist by title
router.delete('/watchlist/:userId/:movieTitle', async (req, res) => {
  const { userId, movieTitle } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the movie by title to delete it from the watchlist
    const initialWatchlistLength = user.watchlist.length;
    user.watchlist = user.watchlist.filter(item => item.movieTitle !== movieTitle);

    if (initialWatchlistLength === user.watchlist.length) {
      return res.status(404).json({ message: 'Movie not found in watchlist' });
    }

    await user.save();
    return res.status(200).json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Error removing movie from watchlist:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
