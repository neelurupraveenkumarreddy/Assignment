import React, { Component } from "react";
import { withRouter } from "../../utils/withRouter";
import "./recordpayment.css";
import Navbar from '../Navbar';
class RecordPayment extends Component {
  state = {
    loan_id: this.props.params.loan_id,
    amount: "",
    payment_type: "EMI", // default option
    response: null,
    loading: false,
  };
  // Handle input changes
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Submit payment
  handleSubmit = async (e) => {
    e.preventDefault();

    const { loan_id, amount, payment_type } = this.state;

    if (!loan_id || !amount) {
      alert("Loan ID and amount are required!");
      return;
    }

    this.setState({ loading: true });

    try {
      const res = await fetch(`/api/loan/payments/${loan_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          payment_type,
        }),
      });

      const data = await res.json();
      this.setState({ response: data, loading: false });
    } catch (error) {
      console.error("Error recording payment:", error);
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <><Navbar/>
      <div className="payment-container">
        <h2 className="payment-title">Record Loan Payment</h2>

        <form className="payment-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="loan_id"
            placeholder="Loan ID"
            value={this.state.loan_id}
            onChange={this.handleChange}
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={this.state.amount}
            onChange={this.handleChange}
          />
          <select
            name="payment_type"
            value={this.state.payment_type}
            onChange={this.handleChange}
          >
            <option value="EMI">EMI</option>
            <option value="Lump Sum">Lump Sum</option>
          </select>
          <button type="submit">Submit Payment</button>
        </form>

        {this.state.loading && <p className="loading-text">Recording payment...</p>}

        {this.state.response && (
          <div className="payment-response">
            <p>Payment ID: {this.state.response.payment_id}</p>
            <p>Loan ID: {this.state.response.loan_id}</p>
            <p>Message: {this.state.response.message}</p>
            <p>Remaining Balance: {this.state.response.remaining_balance}</p>
            <p>EMIs Left: {this.state.response.emis_left}</p>
          </div>
        )}
      </div>
      </>
    );
  }
}

export default withRouter(RecordPayment);
