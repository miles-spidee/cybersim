import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Articles() {
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "🛡️ OS Hardening",
      description: "Learn how to secure your operating system against real-world cyber threats.",
      path: "/articles/os-hardening",
    },
    {
      id: 2,
      title: "💥 Penetration Testing",
      description: "Understand ethical hacking methodologies, tools, and reporting practices.",
      path: "/articles/pentesting",
    },
  ];

  return (
    <div className="articles-container">
      <h1 className="text-4xl text-center text-white mb-8 mt-10">
        📚 Cybersecurity Articles
      </h1>
      <p className="text-gray-400 text-center mb-12">
        Choose a topic to learn deeply about security concepts and best practices.
      </p>

      <div className="article-grid">
        {articles.map((a) => (
          <div
            key={a.id}
            className="article-card"
            onClick={() => navigate(a.path)}
          >
            <h2>{a.title}</h2>
            <p>{a.description}</p>
            <button className="btn primary mt-4">Read More →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
