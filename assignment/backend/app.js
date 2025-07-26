const express = require("express");
const cors=require("cors");

const customerRoutes=require("./Routes/customerRoutes")
const loanRoutes=require("./Routes/loanRoutes")
const app=express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "http://localhost:3000", // React app URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use("/api/customers",customerRoutes);
app.use("/api/loan",loanRoutes);
app.listen(8080,()=>{
    console.log("Server is running...");
});