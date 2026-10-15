import 'dotenv/config'
import cors from 'cors' 
import express from 'express'

import { getPool } from "./db/pool.js";

const app=express();
const port=Number(process.env.PORT) || 4000;
const appOrigin=process.env.APP_URL ?? "http://localhost:3000";

//two pieces of middleware, which run before route handlers
app.use(
    cors(({ 
        origin:appOrigin, //Configures CORS so a browser can allow your frontend to access the backend across different origins, like diff ports 
        credentials:true //permits credentialed browser requests, such as requests carrying cookies
    }))
)
app.use(express.json()) //Parses incoming JSON request bodies and makes them available as req.body

// First ROUTE
app.get("/health", async (_req, res) => {
  try {
    await getPool().query("SELECT 1");
    res.json({ status: "ok", service: "agentic-calendar-app", database: "up" });
  } catch {
    res.status(503).json({
      status: "error",
      service: "agentic-calendar-app",
      database: "down",
    });
  }
});

app.listen(port,()=>{ //Starts accepting HTTP requests
    console.log(`Agentic Calender App is running on port: ${port}`);
})
