import React, { useState } from "react";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "user" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏦 iBanking Application</h1>
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        ) : (
          <div className="dashboard">
            <h2>Welcome, {username}</h2>
            <div className="account-summary">
              <h3>Account Summary</h3>
              <p>Balance: ₹1,25,000</p>
              <p>Account Number: 1234 5678 9012</p>
            </div>
            <div className="transactions">
              <h3>Recent Transactions</h3>
              <ul>
                <li>+ ₹5,000 - Salary</li>
                <li>- ₹2,000 - Grocery</li>
                <li>- ₹1,000 - Electricity Bill</li>
              </ul>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

