# Security Policy - Sanjeevani AI

The security, privacy, and integrity of **Sanjeevani AI** are paramount. This document outlines our security practices, secret handling rules, and vulnerability reporting process.

---

## 🛡️ Supported Versions

| Version | Supported | Notes |
| :--- | :---: | :--- |
| `1.0.x` (Current `main`) | ✅ Yes | Active development version |
| `< 1.0.0` | ❌ No | Deprecated development iterations |

---

## 🔒 Responsible Vulnerability Reporting

If you discover a potential security vulnerability (such as exposed secrets, prompt injection vectors, CORS misconfigurations, or dependency vulnerabilities), please report it responsibly:

### How to Submit a Report
- **Preferred Method**: Submit a private **[GitHub Security Advisory](https://github.com/aastha-yadav2/Sanjeeveni/security/advisories/new)** directly through the repository interface.
- Alternatively, if security advisories are disabled, open a GitHub Issue tagged with `[SECURITY]` without posting actionable exploit payloads publicly.

### What to Include in Your Report
1. Detailed description of the vulnerability.
2. Steps to reproduce the issue (including sample payloads or HTTP requests).
3. Impact assessment (e.g., potential secret leakage, unauthorized data access, API denial of service).
4. Suggested remediation if available.

We request that you allow maintainers reasonable time to investigate and patch reported vulnerabilities before public disclosure.

---

## 🔑 Secret & API Key Management

1. **Zero Hardcoded Secrets**:
   - The repository code strictly reads API keys (such as `GEMMA_API_KEY`) from environment variables (`.env`).
   - `.env` and `.env.local` files are listed in `.gitignore` and must **NEVER** be committed to version control.
2. **Client-Side Safety**:
   - The React frontend connects exclusively to backend API endpoints (`/api/chat`, `/api/session/new`).
   - The Google Gemma API key is kept securely on the FastAPI server and is **never** exposed to the web browser.

---

## 🏥 User Health Data & Privacy Precautions

- **No Personal Identifiable Information (PII) Storage**: Sanjeevani AI does not collect or store full names, social security numbers, insurance IDs, or addresses.
- **Local Browser Session Scope**: Conversation state is stored in memory and temporary browser storage during active sessions.
- **Encrypted In-Transit Communication**: Production deployments must enforce HTTPS / TLS for all API communication between frontend and backend.

---

## 🤖 AI & LLM Security Considerations

- **Structured Output Parsing**: All Google Gemma AI responses undergo JSON regex extraction and Pydantic schema validation to prevent malformed payloads or unhandled string injection.
- **Safety Interceptors**: Emergency red-flag keywords (such as chest pain, dyspnea, or unconsciousness) trigger hardcoded safety overrides directing users to 911 / 108 emergency care.
- **Prompt Injection Defense**: Patient inputs are sanitized and passed inside strict JSON context boundaries to prevent system prompt overrides.

---

## 📦 Dependency Security

Maintainers regularly audit dependencies:
```bash
# Frontend vulnerability audit
npm audit

# Python dependency checks
pip list --outdated
```
