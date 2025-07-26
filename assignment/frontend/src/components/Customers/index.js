import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./customer.css";
import Navbar from '../Navbar'

class Customers extends Component {
  state = {
    customers: [],
    loading: true,
    customer_name: "",
    contact_number: "",
    address: "",
  };

  fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers/all");
      const data = await res.json();

      this.setState({
        customers: data.data || [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCreateCustomer = async (e) => {
    e.preventDefault();

    const { customer_name, contact_number, address } = this.state;

    if (!customer_name || !contact_number) {
      alert("Name and contact number are required!");
      return;
    }

    try {
      const res = await fetch("/api/customers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name,
          contact_number,
          address,
        }),
      });

      if (res.ok) {
        this.setState({ customer_name: "", contact_number: "", address: "" });
        this.fetchCustomers();
      } else {
        alert("Error creating customer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  render() {
    if (this.state.loading) {
      return <><Navbar/><p className="loading-text">Loading customers...</p></>;
    }

    return (
      <><Navbar/>
      <div className="customers-container">
        <h2 className="customers-title">Customers</h2>

        {/* Create Customer Form */}
        <form className="customer-form" onSubmit={this.handleCreateCustomer}>
          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={this.state.customer_name}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            name="contact_number"
            placeholder="Contact Number"
            value={this.state.contact_number}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={this.state.address}
            onChange={this.handleChange}
          />
          <button type="submit">Create Customer</button>
        </form>

        {/* Customers List */}
        {this.state.customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer Name & ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map((c) => (
                <tr key={c.customer_id}>
                  <td>{c.customer_name} - {c.customer_id}</td>
                  <td>{c.customer_name}</td>
                  <td>{c.contact_number}</td>
                  <td>{c.address}</td>
                  <td>{c.created_at}</td>
                  <td>
                    <Link className="customer-form" to={`/customers/loans/${c.customer_id}`}>
                      <button>View Loans</button>
                    </Link>
                    <Link className="customer-form" to={`/customers/createloan/${c.customer_id}`}>
                      <button>Create Loan</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></>
    );
  }
}

export default Customers;
