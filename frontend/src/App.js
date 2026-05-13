import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handlePredict = async () => {
    if (!text.trim()) {
      alert('Please enter some medical text!');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        text: text
      });
      setResult(response.data);
    } catch (error) {
      alert('Error connecting to backend! Make sure Flask is running.');
    }
    setLoading(false);
  };

  const handleHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/history');
      setHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      alert('Error fetching history!');
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
  };

  return (
    <div className="app">

      {/* Header */}
      <div className="header">
        <h1>🏥 Medical Content Credibility Detector</h1>
        <p>Detect whether medical content is Reliable or Unreliable using AI</p>
      </div>

      {/* Main Container */}
      <div className="container">

        {/* Input Section */}
        <div className="input-section">
          <h2>Enter Medical Text</h2>
          <textarea
            className="text-input"
            placeholder="Enter medical content here... (e.g. Patient diagnosed with Cancer. Paracetamol prescribed by doctor under medical supervision.)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />
          <div className="button-group">
            <button className="predict-btn" onClick={handlePredict} disabled={loading}>
              {loading ? 'Analyzing...' : '🔍 Analyze'}
            </button>
            <button className="clear-btn" onClick={handleClear}>
              🗑️ Clear
            </button>
            <button className="history-btn" onClick={handleHistory}>
              📋 History
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className={`result-section ${result.prediction === 'Reliable' ? 'reliable' : 'unreliable'}`}>
            <h2>Analysis Result</h2>
            <div className="result-content">
              <div className="prediction-badge">
                {result.prediction === 'Reliable' ? '✅' : '❌'} {result.prediction}
              </div>
              <div className="confidence">
                <p>Confidence Score</p>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <p className="confidence-value">{result.confidence}%</p>
              </div>
              <p className="result-message">
                {result.prediction === 'Reliable'
                  ? '✅ This medical content appears to be from a credible source with professional medical guidance.'
                  : '⚠️ This medical content appears to be unreliable. It may contain misleading or unverified medical claims.'}
              </p>
            </div>
          </div>
        )}

        {/* History Section */}
        {showHistory && (
          <div className="history-section">
            <div className="history-header">
              <h2>📋 Prediction History</h2>
              <button className="close-btn" onClick={() => setShowHistory(false)}>✕ Close</button>
            </div>
            {history.length === 0 ? (
              <p>No history found!</p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Text</th>
                    <th>Prediction</th>
                    <th>Confidence</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="text-cell">{item.text.substring(0, 60)}...</td>
                      <td className={item.prediction === 'Reliable' ? 'reliable-text' : 'unreliable-text'}>
                        {item.prediction === 'Reliable' ? '✅' : '❌'} {item.prediction}
                      </td>
                      <td>{item.confidence}%</td>
                      <td>{new Date(item.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="footer">
        <p>Medical Credibility Detector — TF-IDF + Random Forest | Mini Project</p>
      </div>

    </div>
  );
}

export default App;