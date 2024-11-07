const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' }));  // Increase to 10MB or more
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // For URL-encoded data
app.use(cors());
const authRoutes = require('./src/app/routes/auth');
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
