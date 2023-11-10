import flask
from flask import request
import sqlite3

app = flask.Flask(__name__)
#app.config["DEBUG"] = True //Enable debug mode to enable hot-reloader

@app.route('/profile', methods = ['GET'])
def profile():
    username = request.args.get('username','')
    password = request.args.get('password','')

    con = sqlite3.connect('calories-db.db')
    cursor = con.exeute(
        """SELECT ID, NAME FROM profile
        WHERE USERNAME = ? AND PASSWORD = ?""",
        (username, password))
    
    row = cursor.fetchone()

    outdata = {}
    if(row is not None):
        userid = row[0]
        name = row [1]
        outdata = {
            'userid': userid,
            'name': name
        }
    else:
        outdata = {"error": "Invalid username or password"}

    return outdata

# adds hots = "0.0.0.0" to make the server publicly available
app.run(host = "0.0.0.0")

