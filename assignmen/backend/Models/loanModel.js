const db = require('../Config/db');

// Create new loan
exports.createLoan = async (
  loan_id,
  customer_id,
  principal_amount,
  total_amount,
  interest_rate,
  loan_period_years,
  monthly_emi,
  loan_status
) => {
  const [result] = await db.query(
    `INSERT INTO loans (
        loan_id, customer_id, principal_amount, total_amount,
        interest_rate, loan_period_years, monthly_emi, loan_status
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      loan_id,
      customer_id,
      principal_amount,
      total_amount,
      interest_rate,
      loan_period_years,
      monthly_emi,
      loan_status
    ]
  );
  return { loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, loan_status };
};

// Get all loans
exports.getAllLoans = async () => {
  const [rows] = await db.query(`SELECT * FROM loans`);
  return rows;
};

// Get loan by ID
exports.getLoanById = async (loan_id) => {
  const [rows] = await db.query(`SELECT * FROM loans WHERE loan_id = ?`, [loan_id]);
  return rows[0];
};

// Get loans by customer
exports.getLoansByCustomer = async (customer_id) => {
  const [rows] = await db.query(`SELECT * FROM loans WHERE customer_id = ?`, [customer_id]);
  return rows;
};

// Update loan status
exports.updateLoanStatus = async (loan_id, loan_status) => {
  await db.query(`UPDATE loans SET loan_status = ? WHERE loan_id = ?`, [loan_status, loan_id]);
};

// Delete loan
exports.deleteLoan = async (loan_id) => {
  await db.query(`DELETE FROM loans WHERE loan_id = ?`, [loan_id]);
};
exports.updateLoanTotalAmount = async (loan_id, new_total_amount) => {
  await db.query(`UPDATE loans SET total_amount = ? WHERE loan_id = ?`, [
    new_total_amount,
    loan_id
  ]);
};
