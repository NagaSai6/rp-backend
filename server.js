import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import express from "express";

import routes from "./app/routes/api.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/helpdesk/", routes);

// database connection
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 9000, () => {
  console.log("server is up on port 9000");
});
