let todos = [];
let id = 1;

exports.getTodos = (req, res) => {
  res.json(todos);
};

exports.getTodoById = (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Not found' });
  res.json(todo);
};

exports.createTodo = (req, res) => {
  const { title, completed = false } = req.body;
  const newTodo = { id: id++, title, completed };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

exports.updateTodo = (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Not found' });

  const { title, completed } = req.body;
  todo.title = title !== undefined ? title : todo.title;
  todo.completed = completed !== undefined ? completed : todo.completed;

  res.json(todo);
};

exports.deleteTodo = (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
};
