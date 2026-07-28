# Contributing to Sanjeevani AI

Thank you for your interest in contributing to **Sanjeevani AI**! We welcome contributions from developers, designers, translators, and healthcare accessibility advocates.

Please read through these guidelines to ensure a smooth contribution process.

---

## 🛠️ Getting Started

### 1. Fork and Clone the Repository
1. Fork the repository on GitHub: [`https://github.com/aastha-yadav2/Sanjeeveni`](https://github.com/aastha-yadav2/Sanjeeveni)
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Sanjeeveni.git
   cd Sanjeeveni
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/aastha-yadav2/Sanjeeveni.git
   ```

---

## ⚙️ Development Environment Setup

### Frontend Setup (React + TypeScript + Vite)
```bash
# Install frontend dependencies
npm install

# Run Vite local development server
npm run dev
```
The frontend dev server runs at `http://localhost:3000` (or `http://localhost:5173`).

### Backend Setup (FastAPI + Python)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
```

Set your configuration in `.env`:
```env
GEMMA_API_KEY=your_google_gemma_api_key_here
GEMMA_MODEL_NAME=gemma-2-9b-it
PORT=8000
HOST=0.0.0.0
```

Start the FastAPI backend server:
```bash
python -m app.main
```
FastAPI server runs at `http://localhost:8000`. Swagger API docs are at `http://localhost:8000/docs`.

---

## 🌿 Branch Naming Conventions

Create a topic branch for your work:
- `feature/description` for new features (e.g., `feature/voice-visualizer-enhancement`)
- `fix/description` for bug fixes (e.g., `fix/language-selector-mobile`)
- `docs/description` for documentation updates (e.g., `docs/api-guide-update`)
- `refactor/description` for code refactoring

```bash
git checkout -b feature/your-feature-name
```

---

## 📐 Coding Expectations

1. **TypeScript Strictness**:
   - Avoid `any` types. Define interfaces in `src/types/triage.ts`.
   - Maintain strict property checks across components.
2. **Backend Pydantic Schemas**:
   - Define data models in `backend/app/models/schemas.py`.
   - Ensure all request/response models derive from `BaseModel`.
3. **No Hardcoded Secrets**:
   - Never commit API keys, `.env` files, or production credentials. Use environment variables.
4. **Clinical Safety & Decoupled Architecture**:
   - Keep medical reasoning inside the backend (`gemma_service.py` / `prompt_manager.py`).
   - Do NOT add medical decision trees or diagnostic logic to the frontend.

---

## 🧪 Verification & Testing

Before committing changes, verify that your code compiles cleanly:

```bash
# Test frontend TypeScript compilation & Vite build
npm run build
```

Verify that `npm run build` exits with **0 errors**.

---

## 📝 Commit Message Guidance

Follow clear, imperative commit messages:

- `feat: add Tamil voice translation support`
- `fix: resolve mobile layout overflow in HealthSummarySidebar`
- `docs: update API endpoints in docs/API.md`
- `refactor: optimize Gemma JSON repair prompt`

---

## 🔀 Pull Request Process

1. Rebase your feature branch on upstream `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. Push changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request on GitHub against the `main` branch.
4. Include a description of what changed, why, and screenshots for UI updates.
5. Acknowledge that your contribution adheres to our [Code of Conduct](CODE_OF_CONDUCT.md) and [Safety Policy](docs/SAFETY.md).

---

## 🐛 Reporting Bugs & Requesting Features

- **Bug Reports**: Open an issue on GitHub detailing steps to reproduce, expected vs actual behavior, and browser/OS details.
- **Feature Requests**: Submit an issue detailing the use case, clinical/UX benefit, and proposed implementation approach.
