import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import {
  Navigation,
  Home,
  Lives,
  AddLive,
  View,
  AddBuyer,
  Buyer,
  AddPurchase,
  Lottery,
  LotteryAdd,
  TaskMonitoring,
  Paluwagan,
  BudgetTracker,
  AddExpense
} from "./components";

ReactDOM.render(
  <Router>
    <Navigation/>
    <div>
      <Container fluid>
        <Row>
          <Col>   
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lives" element={<Lives />} />
              <Route path="/lives/add" element={<AddLive />} />
              <Route path="/lives/view/" element={<View />} />
              <Route path="/lives/view/buyer/add" element={<AddBuyer />} />
              <Route path="/lives/view/buyer/manage" element={<Buyer />} />
              <Route path="/lives/view/buyer/purchases/add/" element={<AddPurchase />} />
              <Route path="/lottery" element={<Lottery />} />
              <Route path="/lottery/add" element={<LotteryAdd />} />
              <Route path="/task/monitoring" element={<TaskMonitoring />} />
              <Route path="/paluwagan" element={<Paluwagan />} />
              <Route path="/budget/tracker" element={<BudgetTracker />} />
              <Route path="/budget/add" element={<AddExpense />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
