import React, { Component } from "react";
import Navbar from '../Navbar';
import "./loanledger.css"; // Import the CSS file
import { withRouter } from "../../utils/withRouter";
class LoanLedger extends Component {
  state = {
    loan_id: "",
    customer_id: "",
    principal: 0,
    total_amount: 0,
    monthly_emi: 0,
    amount_paid: 0,
    balance_amount: 0,
    emis_left: 0,
    transactions: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchLoanLedger();
  }
    fetchLoanLedger = async () => {
        const {loan_id} = this.props.params;
        console.log(loan_id);
    try {
      const response = await fetch(`/api/loan/ledger/${loan_id}`);
      const data = await response.json();
    console.log(data);
      this.setState({
        loan_id: data.loan_id,
        customer_id: data.customer_id,
        principal: data.principal,
        total_amount: data.total_amount,
        monthly_emi: data.monthly_emi,
        amount_paid: data.amount_paid,
        balance_amount: data.balance_amount,
        emis_left: data.emis_left,
        transactions: data.transactions,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching ledger:", error);
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loading) {
      return <p className="loading-text">Loading...</p>;
    }

    return (
      <><Navbar/>
      <div className="ledger-container">
        <h2 className="ledger-title">Loan Ledger</h2>

        <table className="loan-details">
  <tbody>
    <tr>
      <th>Loan ID</th>
      <td>{this.state.loan_id}</td>
    </tr>
    <tr>
      <th>Customer ID</th>
      <td>{this.state.customer_id}</td>
    </tr>
    <tr>
      <th>Principal</th>
      <td>{this.state.principal}</td>
    </tr>
    <tr>
      <th>Total Amount</th>
      <td>{this.state.total_amount}</td>
    </tr>
    <tr>
      <th>Monthly EMI</th>
      <td>{this.state.monthly_emi}</td>
    </tr>
    <tr>
      <th>Amount Paid</th>
      <td>{this.state.amount_paid}</td>
    </tr>
    <tr>
      <th>Balance Amount</th>
      <td>{this.state.balance_amount}</td>
    </tr>
    <tr>
      <th>EMIs Left</th>
      <td>{this.state.emis_left}</td>
    </tr>
  </tbody>
</table>


        <h3 className="transaction-title">Transactions</h3>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {this.state.transactions.map((t) => (
              <tr key={t.transaction_id}>
                <td>{t.transaction_id}</td>
                <td>{t.date}</td>
                <td>{t.amount}</td>
                <td>{t.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></>
    );
  }
}

export default withRouter(LoanLedger);
