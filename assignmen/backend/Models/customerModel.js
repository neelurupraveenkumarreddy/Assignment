const db = require('../Config/db');

// Create new customer
exports.createCustomer = async (customer_id, customer_name, contact_number, address) => {
  const [result] = await db.query(
    `INSERT INTO customers (customer_id, customer_name, contact_number, address)
     VALUES (?, ?, ?, ?)`,
    [customer_id, customer_name, contact_number, address]
  );
  return { customer_id, customer_name, contact_number, address };
};

// Get all customers
exports.getAllCustomers = async () => {
  const [rows] = await db.query(`SELECT * FROM customers`);
  return rows;
};

// Get customer by ID
exports.getCustomerById = async (customer_id) => {
  const [rows] = await db.query(`SELECT * FROM customers WHERE customer_id = ?`, [customer_id]);
  return rows[0];
};

// Update customer
exports.updateCustomer = async (customer_id, customer_name, contact_number, address) => {
  await db.query(
    `UPDATE customers SET customer_name = ?, contact_number = ?, address = ? WHERE customer_id = ?`,
    [customer_name, contact_number, address, customer_id]
  );
};

// Delete customer
exports.deleteCustomer = async (customer_id) => {
  await db.query(`DELETE FROM customers WHERE customer_id = ?`, [customer_id]);
};
