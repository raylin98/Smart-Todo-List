const express = require('express');
const router = express.Router();
const { addTask } = require('../db/queries/tasks');
const { getTasks } = require('../db/queries/tasks');
const { Configuration, OpenAIApi } = require("openai");

router.get('/', (req, res) => {
  // still looks for task key if undefined from ejs
  res.render('tasks', {tasks:undefined});
});

/** ============   TASKS ROUTES    =============================== */
/** ----- GET /Tasks  ----- */
    /**   "/TASKS"    GET:  DISPLAYS TASK: Gets tasks of current user
     *       - current user is user_id stored in session cookie user in user object
     *  - ERROR: send a message if the user is not logged in
     *  - REDIRECTS: to /TASKS_INDEX tasks index page and renders if user is logged in
     */
router.get('/tasks', (req, res) => {
getTasks(formattedResponse)
.then((result) => {
  const templateVars = {
    tasks:result
  }
  console.log("tasks being logged", result);
  res.render('tasks', templateVars);
  })
  .catch((err) => console.log(err));
  console.log("here")
});


router.get('/add', (req,res) => {
  res.render('add-task');
});

const config = new Configuration({
  apiKey: "INSERT API KEY HERE",
});

const openai = new OpenAIApi(config);

const runPrompt = async (taskName) => {
  const prompt = `If you can categorize ${taskName} based on one of the following categories:
  1. Eat
  2. Watch
  3. Read
  4. Buy
  5. Others

Please enter the corresponding number (1-5) for the category that best fits the task.`;

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

  const userSubmission = taskData.task_name;
  let category;

  try {
    category = await runPrompt(userSubmission);
    category = parseInt(category);

    if (isNaN(category)) {
      throw new Error("Invalid category ID received.");
    }
  } catch (error) {
    console.error("Error categorizing task:", error);
    category = null; // Set category to null if there's an error
  }

  if (category === null) {
    category = 5; // Set category_id to 5 if category is null
  }

  const formattedResponse = {
    category_id: category,
    user_id: 1,
    task_name: taskData.task_name,
    task_description: taskData.task_description,
    date_created: new Date().toJSON(),
    date_completed: null,
    category: category,
  };

  console.log("Formatted Response:", formattedResponse);

  addTask(formattedResponse)
    .then((result) => {
      console.log(result);
      res.redirect('/tasks');
    })
    .catch((err) => console.log(err));
});




module.exports = router;
