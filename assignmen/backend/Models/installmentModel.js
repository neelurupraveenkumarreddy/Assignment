const db = require('../Config/db');

// Create new installment
exports.createInstallment = async (
  installment_id,
  loan_id,
  customer_id,
  amount,
  installment_type
) => {
  const [result] = await db.query(
    `INSERT INTO installments (
        installment_id, loan_id, customer_id, amount, installment_type
     ) VALUES (?, ?, ?, ?, ?)`,
    [installment_id, loan_id, customer_id, amount, installment_type]
  );
  return { installment_id, loan_id, customer_id, amount, installment_type };
};

// Get installments by loan
exports.getInstallmentsByLoan = async (loan_id) => {
  const [rows] = await db.query(`SELECT * FROM installments WHERE loan_id = ?`, [loan_id]);
  return rows;
};

// Get installments by customer
exports.getInstallmentsByCustomer = async (customer_id) => {
  const [rows] = await db.query(`SELECT * FROM installments WHERE customer_id = ?`, [customer_id]);
  return rows;
};

// Delete installment
exports.deleteInstallment = async (installment_id) => {
  await db.query(`DELETE FROM installments WHERE installment_id = ?`, [installment_id]);
};
