FROM python:3.10-slim

WORKDIR /app

# Upgrade pip and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory into the container
COPY backend/ /app/

# Expose the port used by FastAPI
EXPOSE 8000

# Run the Uvicorn server (Koyeb automatically maps the PORT)
CMD ["sh", "-c", "uvicorn api.server:app --host 0.0.0.0 --port ${PORT:-8000}"]
