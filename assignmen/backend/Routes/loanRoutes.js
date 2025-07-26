const express=require("express");
const router=express.Router();
const loanController=require("../Controllers/loanController");

router.get("/ledger/:loan_id",loanController.LoanLedger);
router.post("/create",loanController.createLoan);
router.post("/payments/:loan_id",loanController.recordPayment);
module.exports=router;