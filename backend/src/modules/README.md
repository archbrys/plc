# Backend Modules

Each module folder contains domain-specific components for future extension:

- `auth/` login/session workflows
- `users/` user lifecycle and profile features
- `questionSets/` quiz set management
- `questions/` question-level operations
- `answers/` answer processing and grading
- `results/` submission history and reports

Current implementation uses `routes/`, `controllers/`, `services/`, `repositories/`, and `validation/` folders to keep concerns separated and easy to grow.
