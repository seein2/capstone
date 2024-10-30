FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5001", "app:app"]