from flask import Flask
from flask_cors import CORS
import time

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)


@app.route("/")
def home():
    return app.send_static_file("index.html")


@app.route("/api/time")
def get_current_time():
    return {"time": time.time()}


if __name__ == "__main__":
    app.run(port=8080)
