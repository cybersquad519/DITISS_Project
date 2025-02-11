FROM python:3.11-slim-buster
WORKDIR /Hash Calculator
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . /app
CMD ["python3", "app.py"]

