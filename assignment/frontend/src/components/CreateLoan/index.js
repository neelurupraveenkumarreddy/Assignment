import React, { Component } from "react";
import { withRouter } from "../../utils/withRouter";
import "./createloan.css";
import Navbar from '../Navbar'
class CreateLoan extends Component {
  state = {
    customer_id: "",
    principal_amount: "",
    interest_rate: "",
    loan_period_years: "",
    loading: false
  };

  componentDidMount() {
    // Pre-fill customer_id if passed via route params
    const { customer_id } = this.props.params;
    if (customer_id) {
      this.setState({ customer_id });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { customer_id, principal_amount, interest_rate, loan_period_years } = this.state;

    if (!customer_id || !principal_amount || !interest_rate || !loan_period_years) {
      alert("All fields are required");
      return;
    }

    this.setState({ loading: true });

    try {
      const res = await fetch("/api/loan/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            customer_id,
            principal_amount: parseFloat(principal_amount),
            interest_rate: parseFloat(interest_rate),
            loan_period_years: parseInt(loan_period_years)
          }
        })
      });

      if (res.ok) {
        alert("Loan created successfully");
        this.setState({
          principal_amount: "",
          interest_rate: "",
          loan_period_years: "",
          loading: false
        });
        this.props.navigate(`/customers/${customer_id}/loans`); // Redirect to loans page
      } else {
        alert("Failed to create loan");
        this.setState({ loading: false });
      }
    } catch (err) {
      console.error("Error creating loan:", err);
      this.setState({ loading: false });
    }
  };

  render() {
    const { customer_id, principal_amount, interest_rate, loan_period_years, loading } = this.state;

    return (
      <><Navbar/>
      <div className="create-loan-container">
        <h2>Create Loan for Customer</h2>
        <form className="create-loan-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="customer_id"
            placeholder="Customer ID"
            value={customer_id}
            onChange={this.handleChange}
            required
          />
          <input
            type="number"
            name="principal_amount"
            placeholder="Principal Amount"
            value={principal_amount}
            onChange={this.handleChange}
            required
          />
          <input
            type="number"
            name="interest_rate"
            placeholder="Interest Rate (%)"
            value={interest_rate}
            onChange={this.handleChange}
            required
          />
          <input
            type="number"
            name="loan_period_years"
            placeholder="Loan Period (Years)"
            value={loan_period_years}
            onChange={this.handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Loan"}
          </button>
        </form>
      </div>
      </>
    );
  }
}

export default withRouter(CreateLoan);
