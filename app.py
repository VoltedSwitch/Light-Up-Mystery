# app.py

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def memory():
    return render_template("memory.html")


if __name__ == "__main__":
    app.run(debug=True)
