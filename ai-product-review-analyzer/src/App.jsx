  import { useState, useEffect } from "react";
  // import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
  import "./App.css";

  function App() {
    const [review, setReview] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    //API Gateway URLs
    const ANALYZE_API = "https://rstl0vraee.execute-api.us-east-1.amazonaws.com/default/analyzeReview";
    const GET_REVIEWS_API = "https://oo2obvjgzk.execute-api.us-east-1.amazonaws.com/default/getReviews";

    // Fetch reviews from DynamoDB
    const fetchReviews = async () => {
      try {
        const res = await fetch(GET_REVIEWS_API);
        const data = await res.json();

        // Sort by timestamp (newest first) and limit to 5
        const sorted = data
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 5);

        setHistory(sorted);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    // Run once on page load
    useEffect(() => {
      fetchReviews();
    }, []);

    // Analyze review and refresh history
    const analyzeReview = async () => {
      if (!review.trim()) return alert("Please enter a review!");
      setLoading(true);
      setResult(null);
      try {
        const res = await fetch(ANALYZE_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewText: review }),
        });

        if (!res.ok) throw new Error("API request failed");

        const data = await res.json();
        setResult(typeof data === "string" ? JSON.parse(data) : data);

        // Refresh review list
        await fetchReviews();
        setReview("");
      } catch (err) {
        console.error("Error:", err);
        alert("Error analyzing review — check the console.");
      } finally {
        setLoading(false);
      }
    };

    const COLORS = {
      POSITIVE: "#10b981",
      NEUTRAL: "#f59e0b",
      NEGATIVE: "#ef4444",
    };

    const getSentimentIcon = (sentiment) => {
      switch (sentiment) {
        case "POSITIVE":
        case "NEGATIVE":
        default:
      }
    };

    const getSentimentColor = (sentiment) =>
      COLORS[sentiment] || COLORS.NEUTRAL;

    const chartData =
      result && result.Score
        ? [
            {
              name: "Confidence",
              value: parseFloat(result.Score) * 100,
              fill: getSentimentColor(result.Sentiment),
            },
            {
              name: "Uncertainty",
              value: 100 - parseFloat(result.Score) * 100,
              fill: "#e5e7eb",
            },
          ]
        : [];

    return (
      <div className="app-container">
        <div style={{ width: "100%", maxWidth: "48rem" }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="gradient-text text-3xl font-bold mb-2">
              AI Sentiment Analyzer 
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.125rem" }}>
              Discover emotional tone in customer reviews
            </p>
          </div>

          {/* Input Card */}
          <div className="main-card">
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "0.75rem",
              }}
            >
              Enter Product Review
            </label>
            <textarea
              className="review-textarea"
              rows="5"
              placeholder="e.g., This product exceeded my expectations and works great!"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>

            <button
              className="analyze-button"
              onClick={analyzeReview}
              disabled={loading || !review.trim()}
            >
              {loading ? "Analyzing..." : "Analyze Sentiment"}
            </button>
          </div>

          {/* Results Card */}
          {result && (
            <div className="results-card">
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                Analysis Results
              </h2>

              {/* 🧠 Detailed Sentiment Breakdown */}
              <div
                className="breakdown-card"
                style={{
                  marginTop: "2rem",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#1e293b",
                    marginBottom: "1rem",
                  }}
                >
                  Sentiment Breakdown
                </h3>

                {result.AllScores && (
                  <div>
                    {Object.entries(result.AllScores).map(([key, value]) => (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#334155",
                            width: "100px",
                          }}
                        >
                          {key}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: "8px",
                            background: "#e2e8f0",
                            borderRadius: "4px",
                            margin: "0 10px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${(value * 100).toFixed(1)}%`,
                              backgroundColor:
                                key === "Positive"
                                  ? "#10b981"
                                  : key === "Negative"
                                  ? "#ef4444"
                                  : key === "Neutral"
                                  ? "#f59e0b"
                                  : "#6366f1",
                              height: "100%",
                            }}
                          ></div>
                        </div>
                        <span
                          style={{
                            width: "60px",
                            textAlign: "right",
                            color: "#475569",
                            fontSize: "0.875rem",
                          }}
                        >
                          {(value * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <br />
              <div className="results-grid"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {/* Sentiment Display */}
                <div className="sentiment-box">
                  <div
                    className="sentiment-icon-wrapper"
                    style={{
                      backgroundColor:
                        getSentimentColor(result.Sentiment) + "20",
                    }}
                  >
                    <div style={{ color: getSentimentColor(result.Sentiment) }}>
                      {getSentimentIcon(result.Sentiment)}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "1.85rem",
                      fontWeight: "bold",
                      color: getSentimentColor(result.Sentiment),
                    }}
                  >
                    {result.Sentiment.toLowerCase()}
                  </p>
                </div>

                {/* Confidence Chart
                <div className="confidence-box">
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#64748b",
                      marginBottom: "1rem",
                    }}
                  >
                    Confidence Score
                  </p>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={55}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <p
                    style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#1e293b",
                    marginTop: "0.5rem",
                  }}
                  >
                    {result?.Score ? (parseFloat(result.Score) * 100).toFixed(1) : "0.0"}%
                  </p>
                </div> */}
                
              </div>
            </div>
          )}

          {/* 🕓 Past Reviews Section */}
          <div
            className="history-card"
            style={{
              marginTop: "2rem",
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              maxHeight: "350px",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              Recent Reviews (Last 5)
            </h2>

            {history && history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    padding: "0.75rem 0",
                  }}
                >
                  <p style={{ color: "#334155", marginBottom: "0.25rem" }}>
                    {item.reviewText}
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color:
                        item.sentiment === "POSITIVE"
                          ? "#10b981"
                          : item.sentiment === "NEGATIVE"
                          ? "#ef4444"
                          : "#f59e0b",
                    }}
                  >
                    {item.sentiment} 
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "0.8rem",
                    }}
                  >
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b" }}>No reviews yet.</p>
            )}
          </div>

          {/* Footer */}
          <div
            className="text-center"
            style={{
              marginTop: "2rem",
              color: "#64748b",
              fontSize: "0.875rem",
            }}
          >
          </div>
        </div>
      </div>
    );
  }

  export default App;
