"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_API_BASE_URL } from "@/lib/admin-api";
import type { AdminUser } from "@/lib/types/admin";

interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
  authToken: string;
  user: AdminUser;
  message: string;
}

export default function AdminBackoffice() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${ADMIN_API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        router.push("/admin-backoffice/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        <div className="admin-login-content">
          <div className="admin-login-header">
            <div className="admin-logo">🔐</div>
            <h1>Admin Backoffice</h1>
            <p>Buyorama Management Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && <div className="admin-error-message">{error}</div>}
            {success && (
              <div className="admin-success-message">
                ✓ Login successful! Redirecting...
              </div>
            )}

            <div className="admin-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Loading...
                </>
              ) : success ? (
                "✓ Logged In"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>
              Back to{" "}
              <Link href="/" className="admin-home-link">
                Home Page
              </Link>
            </p>
          </div>
        </div>

        <div className="admin-login-background"></div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .admin-login-wrapper {
          width: 100%;
          max-width: 420px;
          position: relative;
        }

        .admin-login-content {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 32px 24px;
          position: relative;
          z-index: 2;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .admin-logo {
          font-size: 40px;
          margin-bottom: 8px;
          display: inline-block;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .admin-login-header h1 {
          font-family: inherit;
          font-size: 28px;
          font-weight: 700;
          color: #222e48;
          margin: 0 0 8px 0;
        }

        .admin-login-header p {
          font-size: 14px;
          color: #808080;
          margin: 0;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-error-message {
          background-color: #fee;
          color: #c33;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          border-left: 3px solid #c33;
          animation: slideDown 0.3s ease-out;
          margin-bottom: 4px;
        }

        .admin-success-message {
          background-color: #efe;
          color: #3a3;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          border-left: 3px solid #3a3;
          animation: slideDown 0.3s ease-out;
          margin-bottom: 4px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #222e48;
        }

        .admin-form-group input {
          padding: 10px 12px;
          border: 2px solid #e8ecef;
          border-radius: 6px;
          font-size: 15px;
          transition: all 0.3s ease;
          background-color: #f8fafc;
        }

        .admin-form-group input:focus {
          outline: none;
          border-color: #667eea;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .admin-form-group input:disabled {
          background-color: #f0f0f0;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .admin-form-group input::placeholder {
          color: #999;
        }

        .admin-login-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 4px;
          min-height: 40px;
        }

        .admin-login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .admin-login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-login-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .admin-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .admin-login-footer {
          text-align: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e8ecef;
        }

        .admin-login-footer p {
          font-size: 13px;
          color: #666;
          margin: 0;
        }

        .admin-home-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
          display: inline-block;
        }

        .admin-home-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .admin-login-background {
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 50px 50px;
          z-index: 1;
        }

        @media (max-width: 480px) {
          .admin-login-content {
            padding: 32px 24px;
          }

          .admin-login-header h1 {
            font-size: 24px;
          }

          .admin-logo {
            font-size: 40px;
          }
        }
      `}</style>
    </div>
  );
}
