const express=require("express");
const router=express.Router();
const customerController=require("../Controllers/customerController");
router.get("/all",customerController.getAllCustomers
);
router.get("/:customer_id",customerController.getCustomerName);
router.post("/create",customerController.createCustomer);
router.get("/loan_summary/:customer_id",customerController.getCustomerLoanSummary);
module.exports=router;