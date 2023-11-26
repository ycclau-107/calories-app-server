import flask
from flask import request
import sqlite3
from flask import jsonify
import json

app = flask.Flask(__name__)
#app.config["DEBUG"] = True //Enable debug mode to enable hot-reloader

#log in
@app.route('/profile/login/signin', methods = ['GET'])
def login_get():
    username = request.args.get('username','')
    password = request.args.get('password','')

    con = sqlite3.connect('calories-db.db')
    cursor = con.execute(
        """SELECT ID, NAME FROM login
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

@app.route('/profile/login/check-username', methods = ['GET'])
def login_check_username():
    username = request.args.get('username','')
    con = sqlite3.connect('calories-db.db')
    cursor = con.execute(
        """SELECT COUNT(*) FROM login
        WHERE USERNAME = ?""",
        (username,))
    
    count = cursor.fetchone()[0]
    con.close()

    if(count == 1):
        return {"error": "This username has been already registered."}
    else:
        return {"result": "This username has not been taken."}

@app.route('/profile/login/signup', methods = ['POST'])
def signup():
    data = request.json
    username = data["username"]
    password = data["password"]

    con = sqlite3.connect('calories-db.db')
    cursor = con.execute("""INSERT INTO login (USERNAME, PASSWORD) VALUES
                         (?, ?)""",
                         (username,password))
    
    con.commit()
    con.close()
    return {"message": "Sign up is completed"}

@app.route('/target/update', methods = ['POST'])
def target_udpate():
    datas = request.get_json()

    con = sqlite3.connect('calories-db.db')
    cursor = con.cursor()

    # check target exists or not
    cursor.execute("""SELECT TARGET_ID FROM target 
                   WHERE USER_ID = ? AND CURRENT = 1
                   ORDER BY ACTIVE DESC""",(datas[0]["user_id"],))
    rows = cursor.fetchall()

    if(len(rows) != 0):
        # update active target
        for i in range(len(rows)):

            tid = rows[i][0]
            user_id = datas[i]['user_id']
            dietstyle = datas[i]['dietstyle']
            bmr = datas[i]['bmr']
            tdee = datas[i]['tdee']
            protein_gram = datas[i]['protein']['gram']
            protein_per = datas[i]['protein']['percentage']
            protein_cal = datas[i]['protein']['calorie']
            carbs_gram = datas[i]['carbs']['gram']
            carbs_per = datas[i]['carbs']['percentage']
            carbs_cal = datas[i]['carbs']['calorie']
            fat_gram = datas[i]['fat']['gram']
            fat_per = datas[i]['fat']['percentage']
            fat_cal = datas[i]['fat']['calorie']
            cursor.execute("""
            UPDATE target SET 
                            DIETSTYLE = ?,
                            BMR = ?, 
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
            """,(dietstyle, 
                bmr, 
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
                tid))
        return {"message": "User:"+ str(user_id) +"'s Target has been updated."
    }
    else:
        active = [1, 0, 0]
        for data, iAct in enumerate(datas,active):
            user_id = data['user_id']
            dietstyle = data['dietstyle']
            bmr = data['bmr']
            tdee = data['tdee']
            protein_gram = data['protein']['gram']
            protein_per = data['protein']['percentage']
            protein_cal = data['protein']['calorie']
            carbs_gram = data['carbs']['gram']
            carbs_per = data['carbs']['percentage']
            carbs_cal = data['carbs']['calorie']
            fat_gram = data['fat']['gram']
            fat_per = data['fat']['percentage']
            fat_cal = data['fat']['calorie']

        cursor.execute("""INSERT INTO target 
                       (USER_ID, 
                       ACITVE,
                       DIETSTYLE,
                       BMR, 
                       TDEE, 
                        PROTEIN_GRAM, 
                        PROTEIN_PER, 
                        PROTEIN_CAL, 
                        CARBS_GRAM, 
                        CARBS_PER, 
                        CARBS_CAL, 
                        FAT_GRAM, 
                        FAT_PER, 
                        FAT_CAL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                        (user_id,
                        iAct,
                        dietstyle,
                        bmr,
                        tdee,
                        protein_gram,
                        protein_per,
                        protein_cal,
                        carbs_gram,
                        carbs_per,
                        carbs_cal,
                        fat_gram,
                        fat_per,
                        fat_cal))

    outdata = {
        "message": "User:"+ str(user_id) +"'s Target has been inserted."
    }

    con.commit()
    con.close()
    return outdata

@app.route('/target/get', methods = ['GET'])
def target_get():
    user_id = request.args.get('user_id','')

    con = sqlite3.connect('calories-db.db')
    cursor = con.execute("""SELECT 
                        DIETSTYLE, 
                        BMR, 
                        TDEE, 
                        PROTEIN_GRAM, 
                        PROTEIN_PER, 
                        PROTEIN_CAL, 
                        CARBS_GRAM, 
                        CARBS_PER, 
                        CARBS_CAL, 
                        FAT_GRAM, 
                        FAT_PER, 
                        FAT_CAL
                        FROM target
                        WHERE USER_ID = ?
                        ORDER BY ACTIVE DESC
                        """,
                        (user_id,))
    
    rows = cursor.fetchall()
    outdata = []
    if(len(rows) == 0):
        return {"error": "no target found"}
    elif(len(rows) != 0):
        for row in rows:
            data = {
                'dietstyle': row[0],
                'bmr': row[1],
                'tdee': row[2],
                'protein':{
                    'percentage': row[4],
                    'gram': row[3],
                    'calorie': row[5],
                },
                'carbs':{
                    'percentage': row[7],
                    'gram': row[6],
                    'calorie': row[8],
                },
                'fat':{
                    'percentage': row[10],
                    'gram': row[9],
                    'calorie': row[11],
                }}
            outdata.append(data)
        
    return jsonify(outdata)

@app.route('/calorie/addrecord', methods = ['POST'])
def calorie_addrecord():

    data = request.get_json()

    user_id = data['user_id']
    food_item = data['food_item']
    calories = data['cal_get']
    protein_gram = data['protein_gram']
    carbs_gram = data['carbs_gram']
    fat_gram = data['fat_gram']
    photo = data['photo']
    input = data["input"]

    con = sqlite3.connect('calories-db.db')
    con.execute(
         """INSERT INTO calorie (USER_ID, FOOD_ITEM, CALORIES, PROTEIN_GRAM, CARBS_GRAM, FAT_GRAM, PHOTO, INPUT)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_id, food_item, calories, protein_gram, carbs_gram, fat_gram, photo, input)
    )
    con.commit()
    con.close()
    return {"result": "calorie record added"}

@app.route('/calorie/viewrecords', methods = ['GET'])
def calorie_viewrecord():

    user_id = request.args.get('user_id')

    con = sqlite3.connect('calories-db.db')
    cursor = con.execute("""SELECT 
                         RECORD_DATE,
                         FOOD_ITEM,
                         CALORIES,
                         PROTEIN_GRAM,
                         CARBS_GRAM,
                         FAT_GRAM,
                         PHOTO,
                         INPUT
                        FROM calorie
                        WHERE USER_ID = ?
                        ORDER BY RECORD_DATE DESC
                        """,
                        (user_id))
                        
    records = [dict((cursor.description[i][0], value) \
                    for i, value in enumerate(row)) for row in cursor.fetchall()]
    
    records = jsonify(records)

    con.commit()
    con.close()
    return records

@app.route('/calories/get/dailyreport',methods = ['GET'])
def calorie_report():
    user_id = request.args.get('user_id','')

    con = sqlite3.connect('calories-db.db')
    cursor_t = con.execute("""
        SELECT TDEE, 
        PROTEIN_GRAM,
        CARBS_GRAM,
        FAT_GRAM FROM target
        WHERE USER_ID = ?""",
        (user_id,))
        
    row_t = cursor_t.fetchone()

    cursor_r = con.execute("""
    SELECT SUM(CALORIES), SUM(PROTEIN_GRAM), SUM(CARBS_GRAM), SUM(FAT_GRAM) FROM calorie
    WHERE USER_ID = ? 
    AND RECORD_DATE = DATE('now')""",
    (user_id,))
    
    row_r = cursor_r.fetchone()

    outdata = {}
    if(row_t !=None):

        calories_t = row_t[0]
        protein_t = row_t[1]
        carbs_t = row_t[2]
        fat_t = row_t[3]

        calories_sum = row_r[0]
        protein_sum = row_r[1]
        carbs_sum = row_r[2]
        fat_sum = row_r[3]

        if(calories_sum is None and protein_sum is None and carbs_sum is None and fat_sum is None):
            calories_sum = 0
            protein_sum = 0
            carbs_sum = 0
            fat_sum = 0
        
        calories_per = int(calories_sum / calories_t * 100)
        protein_per = int(protein_sum / protein_t * 100)
        carbs_per = int(carbs_sum / carbs_t * 100)
        fat_per = int(fat_sum / fat_t * 100)

        outdata = {
            "calorie_sum": calories_sum,
            "calorie_per": calories_per,
            "protein_sum": protein_sum,
            "protein_per": protein_per,
            "carbs_sum": carbs_sum,
            "carbs_per": carbs_per,
            "fat_sum": fat_sum,
            "fat_per": fat_per
        }
    else:
        outdata = {"error": "Target has not been set."}
    
    con.commit()
    con.close()
    return outdata

@app.route('/calories/get/weeksum',methods = ['GET'])
def getCalorieWeekSum():
    user_id = request.args.get('user_id','')

    con = sqlite3.connect('calories-db.db')
    cursor_r = con.execute("""
                            SELECT RECORD_DATE, SUM(CALORIES), SUM(PROTEIN_GRAM), SUM(CARBS_GRAM), SUM(FAT_GRAM) FROM calorie
                            WHERE USER_ID = ? 
                            AND RECORD_DATE >= DATE('now', '-7 days')
                            GROUP BY RECORD_DATE
                            ORDER BY RECORD_DATE DESC
                            """,(user_id,))

    rows = cursor_r.fetchall()
    results = []

    for row in rows:
        date = row[0]
        calorie = row[1]
        protein = row[2]
        carbs = row[3]
        fat = row[4]
        result = {
            date: date,
            calorie: calorie,
            protein: protein,
            carbs: carbs,
            fat: fat
        }
        results.append(result)
    resultJson = jsonify(results)

    con.close()

    return resultJson

@app.route('/weight/add',methods = ['POST'])
def weight_addrecord():
    data = request.get_json()
    user_id = data['user_id']
    weight = data['weight']
    
    con = sqlite3.connect('calories-db.db')
    con.execute("""
        INSERT INTO weight (user_id, weight) VALUES(?,?,)""",
        (user_id, weight))
    
    con.commit()
    con.close()
    return {'result': "weight record added"}

@app.route('/weight/get', methods = ['GET'])
def weight_getrecord():
    user_id = request.args.get('user_id','')
    
    # Connect to the database
    conn = sqlite3.connect('calories-db.db')
    cursor = conn.cursor()

    # Execute the SELECT query
    cursor.execute("SELECT RECORD_DATE, WEIGHT, BODY_FAT FROM weight WHERE user_id = ?", (user_id,))

    # Fetch all the rows returned by the query
    rows = cursor.fetchall()

    # Create a list to store the weight records
    weight_records = []

    # Process the fetched data
    for row in rows:
        # Access the columns by index or name
        record_date = row[0]
        weight = row[1]
        body_fat = row[2]

        # Create a dictionary for the weight record
        weight_record = {
            'record_date': record_date,
            'weight': weight,
            'body_fat': body_fat
        }

        # Append the weight record to the list
        weight_records.append(weight_record)

    # Close the connection
    conn.close()

    # Return the weight records as JSON
    return jsonify(weight_records)

@app.route('/exercise/add', methods = ['POST'])
def exercise_record_add():
    data = request.get_json()

    user_id = data['user_id']
    calories = data['calories']
    type = data['type']
    heartrate = data['heartrate']

    con = sqlite3.connect('calories-db.db')
    con.execute(
        """INSERT INTO exercise_record 
        (USER_ID, CALORIES, TYPE, HEARTRATE VALUES (?, ?, ?, ?)""",
        (user_id, calories, type, heartrate)
    )
    con.commit()
    con.close()
    return {"result": "exercise record added"}

@app.route('/exercise/get', methods = ['GET'])
def exercise_getrecord():
    user_id = request.args.get('userid')
    
    conn = sqlite3.connect('calories-db.db')
    cursor = conn.cursor()

    cursor.execute("SELECT RECORD_DATE, CALORIES, HEARTRATE FROM exercise WHERE USER_ID = ?", (user_id,))

    # Fetch all the rows returned by the query
    rows = cursor.fetchall()

    # Create a list to store the exercise records
    exercise_records = []

    # Process the fetched data
    for row in rows:
        # Access the columns by index or name
        record_date = row[0]
        calories = row[1]
        heart_rate = row[2]

        # Create a dictionary for the exercise record
        exercise_record = {
            'record_date': record_date,
            'calories': calories,
            'heart_rate': heart_rate
        }

        # Append the exercise record to the list
        exercise_records.append(exercise_record)

    # Close the connection
    conn.close()

    # Return the exercise records as JSON
    return jsonify(exercise_records)
    

# adds hots = "0.0.0.0" to make the server publicly available
app.run(host = "0.0.0.0")