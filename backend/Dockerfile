# =============================================================
# backend/Dockerfile
# Builds the Python Flask container
# =============================================================

# Use an official lightweight Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy only requirements first (Docker caches this layer for speed)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose Flask's port
EXPOSE 5000

# Command to start Flask
CMD ["python", "app.py"]
