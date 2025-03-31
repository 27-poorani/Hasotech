const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userRoutes = require('./haso/routes/userRoutes');
const { Users, Jobs } = require('./haso/models/stepDbSchema');
const jwt = require('jsonwebtoken');
const jobRoutes = require("./haso/routes/jobroutes.js"); // ✅ Ensure correct path



const app = express();


// Middleware
// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
}));

app.use(express.json());

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Routes
app.use('/registration', userRoutes);
app.use("/jobs", jobRoutes); 

// Add job routes
// Add auth middleware
// Add a test route to check if jobs can be fetched
app.get('/test/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log('Testing job fetch with ID:', jobId);

    // First, check if Jobs collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const jobsCollection = collections.find(c => c.name === 'jobs');
    
    if (!jobsCollection) {
      return res.status(404).json({
        success: false,
        message: 'Jobs collection not found in database'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID format' 
      });
    }

    const job = await Jobs.findById(jobId);
    console.log('Found job:', job);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching job details',
      error: error.message 
    });
  }
});

// Also update the verifyToken middleware with more logging
const verifyToken = (req, res, next) => {
  try {
    console.log('Headers received:', req.headers); // Log all headers
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authorization header missing' 
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authorization format. Use: Bearer <token>' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token not provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

// Apply middleware to job routes
// Add MongoDB connection
mongoose.connect('mongodb://localhost:27017/STEP', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Update the job route with more detailed error handling
app.get('/jobs/job/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log('Attempting to fetch job with ID:', jobId);

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID format' 
      });
    }

    const job = await Jobs.findById(jobId);
    console.log('Found job:', job); // Debug log
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching job details',
      error: error.message 
    });
  }
});

app.put('/jobs/update/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;
    
    const updatedJob = await Jobs.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    res.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, message: 'Error updating job' });
  }
});

// Password update route
app.post("/registration/update-password", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received password update request for email:', email); // Debug log

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required." 
            });
        }

        const normalizedEmail = email.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Try to find and update user in Users collection
        const user = await Users.findOneAndUpdate(
            { email: normalizedEmail }, 
            { 
                password: hashedPassword,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!user) {
            console.log('User not found in database for email:', normalizedEmail); // Debug log
            return res.status(404).json({ 
                success: false, 
                message: "User not found." 
            });
        }

        console.log('Password updated successfully for user:', normalizedEmail); // Debug log
        res.json({ 
            success: true, 
            message: "Password updated successfully." 
        });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error." 
        });
    }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Add this after your MongoDB connection
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Add this to test MongoDB connection
app.get('/test/db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ 
      success: true, 
      message: 'Database connected',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database error',
      error: error.message 
    });
  }
});

// Update your test jobs route
app.get('/test/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log('Testing job fetch with ID:', jobId);

    // First, check if Jobs collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const jobsCollection = collections.find(c => c.name === 'jobs');
    
    if (!jobsCollection) {
      return res.status(404).json({
        success: false,
        message: 'Jobs collection not found in database'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID format' 
      });
    }

    const job = await Jobs.findById(jobId);
    console.log('Found job:', job);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching job details',
      error: error.message 
    });
  }
});

