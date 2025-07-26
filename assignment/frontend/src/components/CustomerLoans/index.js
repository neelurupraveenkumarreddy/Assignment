import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "../../utils/withRouter";
import "./customerloan.css";
import Navbar from '../Navbar'
class CustomerLoans extends Component {
  state = {
    loans: [],
    loading: true,
    customer_id: "",
    customer_name:"",
    details: {}
  };

  fetchCustomerLoans = async () => {
    const { customer_id } = this.props.params;
    try {
      const res = await fetch(`/api/customers/loan_summary/${customer_id}`);
      const customerRes=await fetch(`/api/customers/${customer_id}`);
      const data = await res.json();
      const customerDat=await customerRes.json();

      this.setState({
        loans: data.loans || [],
        details: data,
        loading: false,
        customer_id,
        customer_name:customerDat.customer_name
      });
    } catch (error) {
      console.error("Error fetching loans:", error);
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    this.fetchCustomerLoans();
  }

  render() {
    const { loans, customer_id, loading ,customer_name} = this.state;

    if (loading) {
      return <><Navbar/><p className="loading-text">Loading loans...</p></>;
    }

    return (
      <><Navbar/>
      <div className="loans-container">
        <h2>Loans for Customer  {customer_name} -{customer_id}</h2>

        {loans.length === 0 ? (
          <p>No loans found for this customer.</p>
        ) : (
          <table className="loans-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Principal</th>
                <th>Total Amount</th>
                <th>Total Interest</th>
                <th>EMI Amount</th>
                <th>Amount Paid</th>
                <th>EMIs Left</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.loan_id}>
                  <td>{loan.loan_id}</td>
                  <td>{loan.principal_amount}</td>
                  <td>{loan.total_amount}</td>
                  <td>{loan.total_interest}</td>
                  <td>{loan.emi_amount}</td>
                  <td>{loan.amount_paid}</td>
                  <td>{loan.emis_left}</td>
                  <td>
                    <Link className="customer" to={`/loans/ledger/${loan.loan_id}`}>
                      <button>View Ledger</button>
                    </Link>
                    <Link className="customer" to={`/loans/payments/${loan.loan_id}`}>
                      <button>Pay</button>
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

export default withRouter(CustomerLoans);
