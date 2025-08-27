const express = require('express');
const app = express();
const todoRoutes = require('./routes/todos');

app.use(express.json());
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Todo App API! Use /api/todos to access todos.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
