const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Todo Backend is running!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

const Todo = mongoose.model('Todo', new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true }
}));

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashedPassword });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    console.log("REGISTRATION ERROR:", error);
    res.status(500).send('Error creating user');
  }
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('User not found');
  if (await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).send('Incorrect password');
  }
});

app.get('/todos', authenticateToken, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.userId });
  res.json(todos);
});

app.post('/todos', authenticateToken, async (req, res) => {
  const todo = new Todo({ userId: req.user.userId, text: req.body.text });
  await todo.save();
  res.json(todo);
});

app.put('/todos/:id', authenticateToken, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId }, 
    { text: req.body.text }, 
    { new: true }
  );
  res.json(todo);
});

app.delete('/todos/:id', authenticateToken, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.sendStatus(204);
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));