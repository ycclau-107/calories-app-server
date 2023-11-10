import sqlite3

#Connects to database
#The .db file is created automatically if it does not exist
con = sqlite3.connect('calories-db.db')

#Creates profile table
con.execute(
    """CREATE TABLE IF NOT EXISTS profile (
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    USERNAME TEXT NOT NULL,
    PASSWORD TEXT NOT NULL,
    NAME TEXT NOT NULL,
    UNIQUE(USERNAME)
    );""")

#create target table
con.execute(
    """CREATE TABLE IF NOT EXISTS target (
    TARGET_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    USER_ID INTEGER NOT NULL,
    UPDATED_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    BMR NUMBER NOT NULL,
    TDEE NUMBER NOT NULL,
    
    PROTEIN_GRAM NUMBER NOT NULL,
    PROTEIN_PER NUMBER NOT NULL,
    PROTEIN_CAL NUMBER NOT NULL,
    
    CARBS_GRAM NUMBER NOT NULL,
    CARBS_PER NUMBER NOT NULL,
    CARBS_CAL NUMBER NOT NULL,
    
    FAT_GRAM NUMBER NOT NULL,
    FAT_PER NUMBER NOT NULL,
    FAT_CAL NUMBER NOT NULL
    );"""
)

#create calorie record table
con.execute(
    """
    CREATE TABLE IF NOT EXISTS calorie_record(
    C_RECORD_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    USER_ID INTEGER NOT NULL,
    PROTEIN_GRAM INTEGER NOT NULL,
    CARBS_GRAM INTEGER NOT NULL,
    FAT_GRAM INTEGER NOT NULL,
    );
    """
)

#create exercise reocrd table
con.execute(
    """
    CREATE TABLE IF NOT EXISTS exercise_record(
    E_RECORD_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    USER_ID INTEGER NOT NULL,
    CALORIES INTEGER NOT NULL,
    HEARTRATE INTEGER,
    );
""")

#insert demo data
demoData_profile = [{'username': 'demo',
            'password': '1234',
            'name': 'Faraday'},
            
            {'username': 'ycclau',
            'password': '12345',
            'name': 'Chris Lau'}
            ]

for profile in demoData_profile:
    insertQuery = "INSERT INTO profile (USERNAME, PASSWORD, NAME) values (?,?,?);"
    con.execute(insertQuery,(profile['username'],profile['password'],profile['name']))

con.commit()
con.close()