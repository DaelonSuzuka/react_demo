# app/Dockerfile

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y npm

COPY ./frontend/package.json /app/frontend/package.json
COPY ./frontend/package-lock.json /app/frontend/package-lock.json
WORKDIR /app/frontend
RUN npm i

COPY ./backend /app/backend
WORKDIR /app/backend
RUN pip3 install -r requirements.txt

COPY ./frontend/src /app/frontend/src
COPY ./frontend/public /app/frontend/public

WORKDIR /app/frontend
RUN npm run build

WORKDIR /app/backend

EXPOSE 5000

ENTRYPOINT ["uvicorn", "main:app", "--host=0.0.0.0", "--port=5000", "--reload"]
