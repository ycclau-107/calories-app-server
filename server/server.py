import flask
from flask import request
import sqlite3

app = flask.Flask(__name__)
#app.config["DEBUG"] = True //Enable debug mode to enable hot-reloader

#log in
@app.route('/profile/get', methods = ['GET'])
def profile_get():
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

    con.commit()
    con.close()

    return outdata

@app.route('/target/update', methods = ['POST'])
def target_udpate():

    user_id = request.args.get('user_id', '')
    bmr = request.args.get('bmr', '')
    tdee = request.args.get('tdee', '')
    protein_gram = request.args.get('protein_gram', '')
    protein_per = request.args.get('protein_per', '')
    protein_cal = request.args.get('protein_cal', '')
    carbs_gram = request.args.get('carbs_gram', '')
    carbs_per = request.args.get('carbs_per', '')
    carbs_cal = request.args.get('carbs_cal', '')
    fat_gram = request.args.get('fat_gram', '')
    fat_per = request.args.get('fat_per', '')
    fat_cal = request.args.get('fat_cal', '')
    
    con = sqlite3.connect('calories-db.db')
    cursor = con.execute("""
    SELECT TARGET_ID FROM target
    WHERE USER_ID = ?
    """,(user_id, ))
    row = cursor.fetchone()

    target_id = row[0]
    if(row is not None):
        con.execute("""
    UPDATE target SET 
                    BMR =?, 
                    TDEE = ?, 
                    PROTEIN_GRAM = ?, 
                    PROTEIN_PER = ?, 
                    PROTEIN_CAL = ?, 
                    CARBS_GRAM = ?, 
                    CARBS_PER = ?, 
                    CARBS_CAL = ?, 
                    FAT_GRAM = ?, 
                    FAT_PER = ?, 
                    FAT_CAL = ?
    WHERE TARGET_ID = ?
    """,(bmr, 
         tdee, 
         protein_gram, 
         protein_per, 
         protein_cal, 
         carbs_gram, 
         carbs_per, 
         carbs_cal, 
         fat_gram, 
         fat_per, 
         fat_cal, 
         target_id))
        
    outdata = {
        "message": "Target data added successfully"
    }

    con.commit()
    con.close()
    return outdata

def calorie_record_add(user_id, protein_gram, carbs_gram, fat_gram):
    # user_id = request.args.get('user_id','')
    # protein_gram = request.args.get('protein_gram,','')
    # carbs_gram = request.args.get('carbs_gram,','')
    # fat_gram = request.args.get('fat_gram,','')

    con = sqlite3.connect('calories-db.db')
    con.execute(
        """INSERT INTO calorie_record (USER_ID, PROTEIN_GRAM, CARBS_GRAM, FAT_GRAM)
        VALUES (?, ?, ?, ?)""",
        (user_id, protein_gram, carbs_gram, fat_gram)
    )
    con.commit()
    con.close()

def exercise_record_add(user_id, calories, type, heartrate):
    con = sqlite3.connect('calories-db.db')
    con.execute(
        """INSERT INTO exercise_record (USER_ID, CALORIES, TYPE, HEARTRATE VALUES (?, ?, ?, ?)""",
        (user_id, calories, type, heartrate)
    )
    con.commit()
    con.close()

# adds hots = "0.0.0.0" to make the server publicly available
app.run(host = "0.0.0.0")

