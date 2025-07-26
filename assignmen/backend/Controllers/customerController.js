const customerModel=require("../Models/customerModel.js");
const loanModel = require("../Models/loanModel");
const installmentModel = require("../Models/installmentModel");
const {v4:uuidv4} = require("uuid");

exports.getAllCustomers = async (req,res)=>{
    try{
        const customerDetails=await customerModel.getAllCustomers();
        res.status(200).json({"data":customerDetails});
    }catch(e){
        res.status(500).json({"error":e});
    }
}
exports.createCustomer = async (req, res) => {
  try {
    const { customer_name, contact_number, address } = req.body;

    if (!customer_name || !contact_number) {
      return res.status(400).json({ error: "Name and contact number are required" });
    }

    const customer_id = uuidv4();

    const newCustomer = await customerModel.createCustomer(
      customer_id,
      customer_name,
      contact_number,
      address
    );

    res.status(201).json(newCustomer);
  } catch (e) {
    console.error("Error creating customer:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getCustomerLoanSummary = async (req, res) => {
  try {
    const { customer_id } = req.params;
    // 1. Get all loans for the customer
    const loans = await loanModel.getLoansByCustomer(customer_id);
    if (!loans || loans.length === 0) {
      return res.status(404).json({ error: "No loans found for this customer" });
    }

    // 2. For each loan, calculate total paid and emis left
    const loan_summaries = [];

    for (const loan of loans) {
      // Fetch all transactions for this loan
      const transactions = await installmentModel.getInstallmentsByLoan(loan.loan_id);

      // Calculate amount paid
      const amount_paid = transactions.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0
      );

      // Calculate remaining balance and EMIs left
      const balance_amount = parseFloat(loan.total_amount) - amount_paid;
      const emis_left = Math.ceil(balance_amount / loan.monthly_emi);

      // Calculate total interest
      const total_interest = parseFloat(loan.total_amount) - parseFloat(loan.principal_amount);

      loan_summaries.push({
        loan_id: loan.loan_id,
        principal_amount: parseFloat(loan.principal_amount),
        total_amount: parseFloat(loan.total_amount),
        total_interest: total_interest,
        emi_amount: parseFloat(loan.monthly_emi),
        amount_paid: amount_paid,
        emis_left: emis_left < 0 ? 0 : emis_left
      });
    }

    // 3. Prepare response
    const response_body = {
      customer_id,
      total_loans: loans.length,
      loans: loan_summaries
    };
    res.status(200).json(response_body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getCustomerName=async(req,res)=>{
  try{
    const { customer_id } = req.params;
    const customerDetails=await customerModel.getCustomerById(customer_id);
    res.status(200).json(customerDetails);
  }catch(e){
    res.statue(500).json({error:e.message});
  }
}