# NextStep AI

NextStep AI is a Django REST API with a static JavaScript frontend for academic profiles, career recommendations, universities, scholarships, and personalized AI career counseling.

## Local development

Requirements: Python 3.13+, PostgreSQL, and optionally Node.js 20+ for frontend checks.

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
createdb nextstep_ai
python backend/manage.py migrate
python backend/manage.py seed_questions
python backend/manage.py seed_fields
python backend/manage.py seed_universities
python backend/manage.py seed_scholarships
python backend/manage.py runserver
```

In another terminal, serve the frontend:

```bash
python3 -m http.server 5500 --directory frontend
```

Open `http://127.0.0.1:5500`. Local defaults connect it to `http://127.0.0.1:8000`.

Copy `.env.example` to `.env` only when configuration overrides are needed. Never commit `.env` or real credentials.

To enable the AI counselor, create a Gemini API key in Google AI Studio and set:

```bash
GEMINI_API_KEY=your-restricted-api-key
GEMINI_MODEL=gemini-3.6-flash
```

The key is used only by Django and is never sent to the browser. Without it, the rest of the application continues to work and the counselor returns a configuration message.

## Verification

```bash
cd backend
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
cd ../frontend && npm run check
```

## Render deployment

The repository includes `render.yaml` for:

- a Gunicorn Django web service;
- managed PostgreSQL;
- a separately deployed static frontend;
- migrations and idempotent catalogue seeding;
- generated secrets, HTTPS security, health checks, and static security headers.

1. Push the repository to GitHub or GitLab.
2. In Render, create a Blueprint from `render.yaml`.
3. Set backend `CORS_ALLOWED_ORIGINS` to the static frontend URL, for example `https://nextstep-ai-web.onrender.com`.
4. Set frontend `API_BASE_URL` to the backend URL, for example `https://nextstep-ai-api.onrender.com`.
5. Set backend `GEMINI_API_KEY` to a restricted Gemini Developer API key.
6. Deploy both services again after the URLs and key are set.
7. Create an administrator from the backend service shell:

```bash
python manage.py createsuperuser
```

For a custom domain, update `CORS_ALLOWED_ORIGINS`; set `ALLOWED_HOSTS` only if the platform hostname or custom domain is not added automatically.

## Production notes

- `DEBUG=False` requires `SECRET_KEY`.
- Production accepts only configured hosts and CORS origins.
- Access tokens expire after 15 minutes and refresh tokens after 7 days by default.
- PostgreSQL connections use `DATABASE_URL` with SSL and connection health checks.
- User-uploaded media needs external object storage if file uploads are introduced; Render's local filesystem is ephemeral.
