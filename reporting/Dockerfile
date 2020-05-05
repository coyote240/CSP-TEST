from python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
ENV FLASK_APP /usr/src/app/service.py
CMD ["python", "-mflask", "run", "--host=0.0.0.0"]
