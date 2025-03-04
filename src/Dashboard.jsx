import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, CreditCard, TrendingUp, DollarSign, Download } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]); // Initialize with an empty array
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [notification, setNotification] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [username, setUsername] = useState(""); // Add state for username
  const [isLoading, setIsLoading] = useState(true); // Add state for loading
  const [transactionSummary, setTransactionSummary] = useState({ withdrawal: 0, deposit: 0 });
  const [isMobile] = useState(window.innerWidth <= 768);
  const [accountNumber, setAccountNumber] = useState(""); // Add this line
  const [selectedOperation, setSelectedOperation] = useState(null); // Add new state for selected operation
  const [identifier, setIdentifier] = useState(""); // Add new state for identifier input

  const balanceAnimation = useSpring({ number: balance, from: { number: 0 }, reset: true });

  const IDLE_TIMEOUT = 60000; // 1 minute in milliseconds

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/");
  }, [navigate]);

  // Auto logout timer setup
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        setNotification("Logged out due to inactivity");
      }, IDLE_TIMEOUT);
    };

    // Events to track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [handleLogout]);

  // Add touch event handling
  const handleTouchStart = useCallback((e) => {
    // Reset auto-logout timer on touch
    resetTimer();
  }, []);

  useEffect(() => {
    // Add touch event listener
    document.addEventListener('touchstart', handleTouchStart);
    
    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleTouchStart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.username) {
        fetchUserData(user.username);
        fetchTransactionSummary(user.username);
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleMpesaCallback = (event) => {
      const data = event.detail;
      if (data.transaction) {
        setTransactions((prevTransactions) => [data.transaction, ...prevTransactions]);
        setBalance((prevBalance) => prevBalance + data.amount);
        setNotification(`Payment of $${data.amount} received from ${data.phone}`);
        setTimeout(() => setNotification(""), 3000);
      }
    };

    window.addEventListener("mpesaCallback", handleMpesaCallback);

    return () => {
      window.removeEventListener("mpesaCallback", handleMpesaCallback);
    };
  }, []);

  const fetchUserData = async (username) => {
    try {
      const userResponse = await axios.get(`https://bank-db.onrender.com/user/${username}`);
      const transactionsResponse = await axios.get(`https://bank-db.onrender.com/user/${username}/transactions`);
      setBalance(userResponse.data.balance);
      setTransactions(transactionsResponse.data.transactions);
      setUsername(userResponse.data.username); // Set the username from the response
      setAccountNumber(userResponse.data.account_number || "XXXX-XXXX-XXXX"); // Add this line
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  };

  const fetchTransactionSummary = async (username) => {
    try {
      const response = await axios.get(`https://bank-db.onrender.com/user/${username}/transaction-summary`);
      if (response.data.success) {
        const { sent, received } = response.data.data;
        setTransactionSummary({
          withdrawal: sent || 0,
          deposit: received || 0
        });
        console.log("Transaction Summary:", { sent, received }); // Debug log
      }
    } catch (error) {
      console.error("Error fetching transaction summary:", error);
    }
  };

  const handleTransaction = async (transactionType) => {
    try {
      const response = await axios.post('https://bank-db.onrender.com/transaction', {
        username,
        transaction_type: transactionType,
        amount: parseFloat(amount),
        identifier: identifier, // This will contain account number, phone number, or agent number
        identifier_type: selectedOperation // This tells the backend what type of identifier it is
      });
      setBalance(response.data.new_balance);
      setTransactions([...transactions, {
        type: transactionType === 'deposit' ? 'Received' : 'Sent',
        transaction_type: transactionType, // Ensure transaction type is correctly set
        amount: transactionType === 'deposit' ? parseFloat(amount) : -parseFloat(amount),
        status: 'completed',
        timestamp: new Date().toISOString() // Ensure date is correctly formatted
      }]);
      fetchTransactionSummary(username); // Refresh the summary data
      
      // Fetch recipient details for notification
      const recipientResponse = await axios.get(`https://bank-db.onrender.com/user/${identifier}`);
      const recipientUsername = recipientResponse.data.username;

      // Updated notification message based on operation type
      const operationMessage = selectedOperation === 'send' ? `sent to account ${identifier} (${recipientUsername})` :
                               selectedOperation === 'deposit' ? 'deposited' :
                               'withdrawn';
      setNotification(`Successfully ${operationMessage} $${amount}`);
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Error processing transaction:", error);
      setNotification(`Transaction failed: ${error.response?.data?.message || error.message}`);
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleProcessTransaction = () => {
    if (!selectedOperation || !identifier || !amount) {
      setNotification("Please fill in all fields");
      return;
    }

    if (selectedOperation === 'deposit') {
      if (amount < 1) {
        setNotification("Invalid amount. Amount must be greater than 1.");
        return;
      }
      if (identifier.length !== 10) {
        setNotification("Invalid phone number. Phone number must be 10 digits.");
        return;
      }
    }

    handleTransaction(selectedOperation === 'deposit' ? 'deposit' : selectedOperation === 'send' ? 'sent' : 'withdrawal');
  };

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
    setIdentifier(""); // Clear identifier input
    setAmount(""); // Clear amount input
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const transactionData = React.useMemo(() => [
    { 
      name: "Sent", 
      value: Math.abs(transactionSummary.withdrawal) || 0, 
      color: "#ff6b6b",
      fill: "#ff6b6b"
    },
    { 
      name: "Received", 
      value: Math.abs(transactionSummary.deposit) || 0, 
      color: "#4caf50",
      fill: "#4caf50"
    }
  ], [transactionSummary]);

  const filteredTransactions = React.useMemo(() => {
    if (!transactions) return [];
    
    const searchLower = searchTerm.toLowerCase();
    
    return transactions
      .filter(transaction => {
        const matchesFilter = filterType === "All" || 
                            transaction.transaction_type === filterType.toLowerCase();
        
        if (!matchesFilter) return false;
        if (!searchTerm) return true;

        return (
          transaction.transaction_type?.toLowerCase().includes(searchLower) ||
          transaction.amount.toString().includes(searchTerm) ||
          transaction.status?.toLowerCase().includes(searchLower) ||
          new Date(transaction.timestamp).toLocaleString().toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (!searchTerm) return new Date(b.timestamp) - new Date(a.timestamp); // Most recent first when no search

        // Check for exact amount matches first
        const aExactAmount = a.amount.toString() === searchTerm;
        const bExactAmount = b.amount.toString() === searchTerm;
        if (aExactAmount && !bExactAmount) return -1;
        if (!aExactAmount && bExactAmount) return 1;

        // Then check for partial amount matches
        const aAmount = a.amount.toString().includes(searchTerm);
        const bAmount = b.amount.toString().includes(searchTerm);
        if (aAmount && !bAmount) return -1;
        if (!aAmount && bAmount) return 1;

        // Then check type matches
        const aType = a.transaction_type?.toLowerCase() === searchLower;
        const bType = b.transaction_type?.toLowerCase() === searchLower;
        if (aType && !bType) return -1;
        if (!aType && bType) return 1;

        // Default to most recent first
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
  }, [transactions, filterType, searchTerm]);

  const getChartDimensions = () => {
    return isMobile ? { height: 150 } : { height: 200 };
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="header">
        <h1 className="title" style={{ color: "linear-gradient(to right, #ff6b6b, #4caf50)" }}>Modern Bank</h1>
        <div className="header-buttons">
          <button className="icon-button" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button className="icon-button" onClick={handleLogout}>
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="balance-section" style={{ height: 'auto', padding: '30px 0' }}> {/* Increase height */}
            <div className="balance-info-container">
              <div className="balance-info">
                <h2>{getGreeting()}, {username}!</h2> {/* Use dynamic username */}
                <p className="account-number">Account: {accountNumber}</p> {/* Add this line */}
              </div>
              <div className="summary-chart">
                <div className="summary">
                  <p className="sent">Sent: <span>-${Math.abs(transactionData[0].value).toFixed(2)}</span></p>
                  <p className="received">Received: <span>${Math.abs(transactionData[1].value).toFixed(2)}</span></p>
                </div>
                <div className="doughnut-chart">
                  <ResponsiveContainer width="100%" height={getChartDimensions().height}>
                    <PieChart>
                      <Pie 
                        data={transactionData} 
                        dataKey="value" 
                        nameKey="name"
                        innerRadius={40} 
                        outerRadius={60}
                        paddingAngle={5}
                      >
                        {transactionData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `$${value.toFixed(2)}`}
                        contentStyle={{
                          background: isDarkMode ? '#333' : '#fff',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <h2 className="balance" style={{ color: '#4caf50' }}>
              $<animated.span>{balanceAnimation.number.to(n => n ? n.toFixed(2) : '0.00')}</animated.span>
            </h2>
          </div>

          <div className="transaction-history">
            <h2>Transaction History</h2>
            <div className="transaction-filters">
              <input
                type="text"
                placeholder="Search transactions"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All</option>
                <option value="sent">sent</option>
                <option value="received">received</option>
                <option value="withdrawal">withdrawal</option>
                <option value="deposit">deposit</option>
              </select>
            </div>
            <div className="transaction-history-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions?.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.timestamp).toLocaleString()}</td> {/* Ensure date is displayed correctly */}
                      <td>{transaction.transaction_type}</td> {/* Ensure type is displayed correctly */}
                      <td>{transaction.amount.toFixed(2)}</td> {/* Ensure amount is displayed correctly */}
                      <td>{transaction.status='completed'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="money-operations">
            <h2>Money Operations</h2>
            <div className="buttons">
              <button 
                className={`send-btn ${selectedOperation === 'send' ? 'selected' : ''}`}
                style={{ 
                  background: selectedOperation === 'send' ? "#1976d2" : "#90caf9",
                  color: "#000000"
                }}
                onClick={() => handleOperationSelect('send')}>
                <CreditCard size={18} color="#000000" /> <strong>Send Money</strong>
              </button>
              <button 
                className={`request-btn ${selectedOperation === 'deposit' ? 'selected' : ''}`}
                style={{ 
                  background: selectedOperation === 'deposit' ? "#2e7d32" : "#a5d6a7",
                  color: "#000000"
                }}
                onClick={() => handleOperationSelect('deposit')}>
                <Download size={18} color="#000000" /> <strong>Deposit</strong>
              </button>
              <button 
                className={`withdraw-btn ${selectedOperation === 'withdraw' ? 'selected' : ''}`}
                style={{ 
                  background: selectedOperation === 'withdraw' ? "#d32f2f" : "#ef9a9a",
                  color: "#000000"
                }}
                onClick={() => handleOperationSelect('withdraw')}>
                <TrendingUp size={18} color="#000000" /> <strong>Withdraw</strong>
              </button>
            </div>
            {selectedOperation && (
              <div className="transaction-inputs">
                {selectedOperation === 'deposit' && (
                  <p style={{ 
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    color: '#81c784',
                    alignSelf: 'flex-start'
                  }}>
                    from M-PESA
                  </p>
                )}
                <input
                  type="text"
                  placeholder={
                    selectedOperation === 'send' ? "Enter account number" :
                    selectedOperation === 'deposit' ? "Enter phone number" :
                    "Enter agent number"
                  }
                  className="input-field"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="input-field"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button 
                  className="process-btn"
                  onClick={handleProcessTransaction}>
                  Process
                </button>
              </div>
            )}
          </div>

          <div className="live-transactions">
            <h2>Live Transactions</h2>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={transactions}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {notification && <div className="notification">{notification}</div>}

      {showRequestPopup && (
        <div className="request-popup">
          <div className="popup-content">
            <h3>Request Money</h3>
            <p>Requesting ${amount} from {phoneNumber}</p>
            <button onClick={() => setShowRequestPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
