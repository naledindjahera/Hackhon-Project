Keep in mind the .env.example file is a blueprint for dev 2 to fill in their local credentials, ensuring no leaks of passwords on GitHub hehe.

## auth.js file in the middleware folder
-Route Protection: Developer 2 can import and attach this middleware to protected API endpoints (POST /api/projects or POST /api/projects/:id/vote) to block unauthorized traffic.  

-User Context: Decoding the JWT attaches req.user (containing user id and role) directly to incoming HTTP requests, enabling Developer 2 to record who cast each vote or submitted each project.  

## auth.js file in the routes folder
- Secure Password Storage: bcryptjs hashes raw passwords with salt rounds prior to persistence in MySQL, preventing plain-text password storage.  

- Stateless Auth Tokens: Successfully authenticating issues a 24-hour signed JSON Web Token (JWT). Developer 1 can store this token in frontend state or localStorage, and Developer 2 can verify it across protected endpoints. 

 + Complete Day 1 Hand-Off: With database connectivity, seed data, JWT middleware, and authentication routes established, Developer 2 can mount routes/auth.js into Express (app.use('/api/auth', authRoutes)) and begin building project submission and voting endpoints. 