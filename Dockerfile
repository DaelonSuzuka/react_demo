# app/Dockerfile

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    npm
#     build-essential \
#     curl \
#     software-properties-common \
#     git \
#     nmap \
#     && rm -rf /var/lib/apt/lists/*

COPY ./frontend/package.json /app/frontend/package.json
COPY ./frontend/package-lock.json /app/frontend/package-lock.json
COPY ./frontend/src /app/frontend/src
COPY ./frontend/public /app/frontend/public
COPY ./backend /app/backend

WORKDIR /app/frontend
RUN npm i
RUN npm run build

WORKDIR /app/backend
RUN pip3 install -r requirements.txt


EXPOSE 5000

ENTRYPOINT ["flask", "--debug", "run", "--host=0.0.0.0"]
