FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (if needed, though this service acts more as a client/worker)
# If we expose an HTTP API later, we'll need this.
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
