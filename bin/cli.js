#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectName = process.argv[2];

if (!projectName) {
  const error = new Error("Please specify the project name");
  console.error(error.message);
  throw error;
}

const currentDir = process.cwd();
const projectDir = path.join(currentDir, projectName);

// Create project directory
fs.mkdirSync(projectDir);

const createDirectories = () => {
  ["controllers", "routes", "models", "middleware"].forEach((dir) => {
    fs.mkdirSync(path.join(projectDir, dir));
  });
};

const createFiles = () => {
  // server.js
  fs.writeFileSync(
    path.join(projectDir, "server.js"),
    `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

//public route example
app.get('/api/not-protected', (req, res) => {
  res.json({ message: 'This is a not protected route' });

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
  `
  );

  // controllers/authController.js
  fs.writeFileSync(
    path.join(projectDir, "controllers", "authController.js"),
    `
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};
  `
  );

  // routes/auth.js
  fs.writeFileSync(
    path.join(projectDir, "routes", "auth.js"),
    `
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
  `
  );

  // models/User.js
  fs.writeFileSync(
    path.join(projectDir, "models", "User.js"),
    `
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
  `
  );

  // middleware/auth.js
  fs.writeFileSync(
    path.join(projectDir, "middleware", "auth.js"),
    `
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
  `
  );

  // .env
  fs.writeFileSync(
    path.join(projectDir, ".env"),
    `
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
PORT=3000
  `
  );
};

const setupProject = () => {
  process.chdir(projectDir);

  // Initialize npm project
  execSync("npm init -y");

  // Install dependencies
  execSync(
    "npm install express mongoose bcryptjs jsonwebtoken dotenv helmet cors express-rate-limit"
  );

  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  packageJson.scripts = {
    ...packageJson.scripts,
    start: "node server.js",
  };
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
};

try {
  createDirectories();
  createFiles();
  setupProject();
  console.log(`Project ${projectName} created successfully!`);
  console.log(`To get started, run the following commands:`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm start`);
} catch (error) {
  console.error("An error occurred:", error);
}
