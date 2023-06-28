const express = require('express');
const router = express.Router();
const { addTask } = require('../db/queries/tasks');
const { Configuration, OpenAIApi } = require("openai");

router.get('/', (req, res) => {
  res.render('tasks');
});

router.get('/add', (req,res) => {
  res.render('add-task');
});

const config = new Configuration({
  apiKey: "",
});

const openai = new OpenAIApi(config);
//prompt for ai to categorise userinput (wip)
const runPrompt = async (taskName) => {
  const prompt = `If you can categorise ${taskName} based on one of the following categories: 1. Eat, 2. Watch, 3. Read, 4. Buy, 5. Others, which would it be?`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2048,
    temperature: 1,
  });

  const category = response.data.choices[0].text.trim();
  return category;
};

router.post('/', async (req, res) => {
  const taskData = req.body;
  taskData.user_id = 1;
  const date = new Date().toJSON();
  taskData.date_created = date;
  console.log(taskData);

  addTask(taskData)
    .then((result) => {
      console.log(result);
      res.redirect('/tasks');
    })
    .catch(err => console.log(err));

  const userSubmission = taskData.task_name;
  const category = await runPrompt(userSubmission);

  const formattedResponse = {
    id: taskData.task,
    category_id: taskData.category,
    user_id: 1,
    task_name: taskData.task.name,
    task_description: taskData.task_description,
    date_created: new Date().toJSON(),
    date_completed: null,
    category: category,
  };

  console.log("Formatted Response:", formattedResponse);

  // Perform further actions based on the categorized task
  res.json(formattedResponse);
});

module.exports = router;
