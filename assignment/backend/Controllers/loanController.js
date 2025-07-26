const loanModel=require("../Models/loanModel");
const {v4:uuidv4} = require("uuid");
const installmentModel=require("../Models/installmentModel");
exports.createLoan=async (req,res)=>{
    try{
        const {data}=req.body;
        const {customer_id,principal_amount,interest_rate,loan_period_years}=data;
        const loan_id=uuidv4();
        const total_interest=principal_amount*loan_period_years*(interest_rate/100);
        const total_amount=total_interest+principal_amount;
        const monthly_emi=total_amount/(loan_period_years*12);
        const loan_status="Due";
        await loanModel.createLoan(loan_id,
            customer_id,
            principal_amount,
            total_amount,
            interest_rate,
            loan_period_years,
            monthly_emi,
            loan_status);
        const responseBdy={
            loan_id,
            total_amount,
            monthly_emi,
            customer_id
        }
        res.status(200).json(responseBdy);
    }catch(e){
        res.status(500).json({"error":e});
    }
}
exports.recordPayment = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;

    // 1. Get loan details
    const loan = await loanModel.getLoanById(loan_id);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // 2. Get all previous payments
    const existingPayments = await installmentModel.getInstallmentsByLoan(loan_id);

    const totalPaidSoFar = existingPayments.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );

    // 3. Add new payment
    const newTotalPaid = totalPaidSoFar + parseFloat(amount);

    // 4. Calculate remaining balance
    const remaining_balance = parseFloat(loan.total_amount) - newTotalPaid;

    // 5. Calculate EMIs left (approx)
    const emis_left = Math.ceil(remaining_balance / loan.monthly_emi);

    // 6. Record the payment in installments table
    const payment_id = uuidv4();
    await installmentModel.createInstallment(
      payment_id,
      loan_id,
      loan.customer_id,
      amount,
      payment_type
    );

    // 7. Update loan status if fully paid
    if (remaining_balance <= 0) {
      await loanModel.updateLoanStatus(loan_id, "PAID");
    }

    // 8. Return response
    res.status(200).json({
      payment_id,
      loan_id,
      message: "Payment recorded successfully.",
      remaining_balance: remaining_balance < 0 ? 0 : remaining_balance,
      emis_left: emis_left < 0 ? 0 : emis_left
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.LoanLedger = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const loan = await loanModel.getLoanById(loan_id);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found"});
    }

    const transactions = await installmentModel.getInstallmentsByLoan(loan_id);

    const amount_paid = transactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );
    const balance_amount = parseFloat(loan.total_amount) - amount_paid;

    const emis_left = Math.ceil(balance_amount / loan.monthly_emi);

    const response_body = {
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      principal: parseFloat(loan.principal_amount),
      total_amount: parseFloat(loan.total_amount),
      monthly_emi: parseFloat(loan.monthly_emi),
      amount_paid: amount_paid,
      balance_amount: balance_amount,
      emis_left: emis_left < 0 ? 0 : emis_left,
      transactions: transactions.map((t) => ({
        transaction_id: t.installment_id,
        date: t.installment_date,
        amount: parseFloat(t.amount),
        type: t.installment_type
      }))
    };

    res.status(200).json(response_body);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};