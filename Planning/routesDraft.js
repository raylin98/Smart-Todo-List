/* ========================================================================== */
/* ==---------------------   RoutesDrafts.js   ----------------------------== */
/* ========================================================================== */
//  Based on the assumption that we could try and recycle some of the routes
//  from tinyApp, I made a copy of those routes & resorted/regrouped them:
//   - regrouped the routes by endpoints (both post and gets)
//   - reordered the routes by functionality on pages with GET followed by POST 


/** ==================== BY PAGE (GET & POST TOGETHER) ====================== */
  /** 1.0.0.0  ============    "/" MAIN PAGE    ============================= */
    /** 1.1.0  "/"         GET: redirect to /TASKS or /LOGIN if not logged in */
      app.get("/", (req, res) => {
        const user = users[req.session["user_id"]];
        if (user) {
          return res.redirect("/tasks");
        }
        res.redirect("/login");
      });


  /** 2.0.0.0  ============   REGISTRATION ROUTES    ======================== */
    /** 2.1.1  "/REGISTER" GET:  REGISTER using user object based & user_id
     *                           stored in session cookie
     *        - REDIRECTS: to main tasks index if already logged in or after registration
     */
      app.get("/register", (req, res) => {
        const user = users[req.session["user_id"]];
        if (user) {
          return res.redirect("tasks");
        }
        const templateVars = {
          user: null,
        };
          res.render("register", templateVars);
      });
    /** 2.1.2  "/REGISTER" POST: registration form (email & pass submit button)
     *        - renders registration page with form requesting email & password
     *  - REQUIRES both email & password & stores user_id in the session cookie
     *  - ERROR: message if email / password missing or user account already exists
     *  - REDIRECTS: to /TASKS showing blank list of user's tasks upon registration
     */
      app.post("/register", (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).send("Insert your email or password");
        }
        if (getUserByEmail(email, users)) {
          return res.status(400).send("Email is already exist");
        }
        const id = generateRandomString();
        users[id] = {
          id,
          email,
          password: bcrypt.hashSync(password, 10),
        };
        req.session.user_id = id;
        res.redirect("/tasks");
      });

  /** 3.0.0.0  ============   /LOGIN ROUTES    ============================== */
    /** 3.1.1  "/LOGIN"    GET:  renders login & redirects to main Task
     *       - gets user object based on user_id stored in session cookie
     *  - REDIRECTS: to main tasks index page if user is logged in
     */
      app.get("/login", (req, res) => {
        const user = users[req.session["user_id"]];
        if (user) {
          return res.redirect("/tasks");
        }
        const templateVars = {
          user: null,
        };
        res.render("login", templateVars);
        });
    /** 3.1.2  "/lOGIN"    POST: users login (email & pass submit button)
     *        - obtains email & password from form submission & checks database obj
     *  - REQUIRES: both email & password submitted & stored in session
     *  - ERROR: messages if info missing or email not found / pass not matching
     *  - REDIRECTS: to login if error or to user's TASKS with successful login
     */
      app.post("/login", (req, res) => {
        const { email, password } = req.body;
        const user = getUserByEmail(email, users);
        if (!user) {
        return res.status(403).send("Email not found");
        }
        if (!bcrypt.compareSync(password, user.password)) {
        return res.status(403).send("Incorrect password");
        }
        req.session.user_id = user.id;
        res.redirect("/tasks");
        });

  /** 4.0.0.0  ============   TASKS ROUTES    =============================== */
    /** 4.1.1  "/TASKS"    GET:  DISPLAYS TASK: Gets tasks of current user
     *       - current user is user_id stored in session cookie user in user object
     *  - ERROR: send a message if the user is not logged in
     *  - REDIRECTS: to /TASKS_INDEX tasks index page and renders if user is logged in
     */
      app.get("/tasks", (req, res) => {
        const user = users[req.session["user_id"]];
        const templateVars = {
          tasks: tasksForUser(req.session["user_id"], urlDatabase),
          user,
        };
        if (!user) {
          return res.send("You must login/register first");
        }
        res.render("tasks_index", templateVars);
      });

    /** 4.1.2  "/TASKS"    POST: GET:List TASKS handler with user_id
     *        - gets user object based on user_id stored in session
     *        - *******uses  for requested entry & deletes urlDatabase *****
     *        - gets longURL from request body & generate random shortURL
     *  - ERROR: message if user is not logged in - please login/register
     *  - REDIRECT: to /TASKS/ user's url index & shows new TASKS if logged in
     */
      app.post("/tasks", (req, res) => {
        const userId = req.session["user_id"];
        const user = users[userId];
        if (!user) {
          return res.send("You must login");
        }
        const longURL = req.body.longURL;
        const shortURL = generateRandomString();
        urlDatabase[TaskID] = {
          longURL,
          userId,
        };
        res.redirect(`/tasks/${taskID}`);
      });

    /** 4.2.1  "/TASKS"    GET:  NEED TO OBTAIN CATEGORY FOR NEW TASK)
     *        also no NEW page as we are staying on main task page
     *        - gets user object based on user_id stored in session
     *  - ERROR: message if user not logged in
     *  - REDIRECT: to page using urls_new template or /login if not logged in
     */
      app.get("/task/new", (req, res) => {
        const user = users[req.session["user_id"]];
        if (!user) {
        return res.redirect("/login");
        }
        const templateVars = {
          user: user,
        };
        res.render("task_new", templateVars);
      });

    /** 4. POST: TASKS/:ID - EDIT handler for user to edit specific TASK
     *        - gets user object based on user_id stored in session
     *        - uses shortURL for requested URL entry & deletes urlDatabase
     *  - ERROR: message if url not in database, user not logged in, url not user's
     *  - REDIRECT: to /urls/ - user's main url index page after successful edit
     */
      app.post("/tasks/:id", (req, res) => {
        const user = users[req.session["user_id"]];
        const shortURL = req.params.id;
        const newLongURL = req.body.longURL;
        urlDatabase[shortURL].longURL = newLongURL;
        if (!urlDatabase[req.params.id]) {
          return res.send("Task doesn't exist");
        }
        if (!user) {
          return res.send("You must login/register first");
        }
        if (urlDatabase[req.params.id].userId !== req.session["user_id"]) {
          return res.send("Not Authorized to access this page");
        }
        res.redirect("/tasks");
      });

    /** 4. POST: TASKS/:ID/DELETE - TASK handler users to delete specific TASK
     *        - gets user object based on user_id stored in session
     *        - uses shortURL for requested TASK entry & deletes urlDatabase
     *  - ERROR: message if TASK not in database, user not logged in, TASK not user's
     *  - REDIRECT: to /TASK/ - user's main TASK index page after successful deletion
     */
      app.post("/tasks/:id/delete", (req, res) => {
        const user = users[req.session["user_id"]];
        const shortURL = req.params.id;
        if (!urlDatabase[req.params.id]) {
        return res.send("task doesn't exist");
        }
        if (!user) {
        return res.send("You must login/register first");
        }
        if (urlDatabase[req.params.id].userId !== req.session["user_id"]) {
        return res.send("Not authorized to access this page");
        }
        delete urlDatabase[shortURL];
        res.redirect("/tasks");
      });

  /** 5.0.0.0  ============   LOGOUT ROUTES    ============================== */
    /**+5.2.3 GET: /LOGOUT logout page with logout message  */
      app.get("/logout", (req, res) => {
        req.session = null;
        const templateVars = {
          user: null,
          logoutMessage1: "Thanks you for visiting TinyApp!",
          logoutMessage2: "We hope to see you again soon!"
        };
        res.render("logout", templateVars);
        });
    /**+5.2.2 POST:/LOGOUT logout request (click) clears & redirects to /login
        *        - upon logout clears session
        *  - REDIRECTS to the "/login" page after logout
        */
      app.post("/logout", (req, res) => {
        req.session = null;
        res.redirect("/logout");
        });

        /** 1.0.0.0  ============   MISC. ROUTES    ================================= */
    /**+5.1.1 GET: NOT LOGGED IN - redirect to /tasks or /login if user is not logged in */
