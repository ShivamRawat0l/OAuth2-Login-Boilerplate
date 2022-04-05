import express from "express";
import privateRoute from "./src/routes/private.route";
import publicRoute from "./src/routes/public.route";
import authRoute from "./src/routes/auth.route";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/private", privateRoute);
app.use("/public", publicRoute);

app.listen(8000, () => {
  console.log("Listening to 8000");
});
