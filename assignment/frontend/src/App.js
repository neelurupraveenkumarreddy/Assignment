import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Customers from "./components/Customers";
import LoanLedger from "./components/LoanLedger";
import RecordPayment from "./components/RecordPayment";
import CustomerLoans from "./components/CustomerLoans";
import CreateLoan from "./components/CreateLoan";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Customers />} />
        <Route path="/loans/ledger/:loan_id" element={<LoanLedger />} />
        <Route path="/loans/payments/:loan_id" element={<RecordPayment />} />
        <Route path="/customers/createloan/:customer_id" element={<CreateLoan/>}/>
        <Route path="/customers/loans/:customer_id" element={<CustomerLoans />} />
      </Routes>
    </Router>
  );
}

export default App;
