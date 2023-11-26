import sqlite3

#Connects to database
#The .db file is created automatically if it does not exist
con = sqlite3.connect('calories-db.db')

#Creates login table
con.execute(
    """CREATE TABLE IF NOT EXISTS login (
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    CREATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    USERNAME TEXT NOT NULL,
    PASSWORD TEXT NOT NULL,
    NAME TEXT NOT NULL,
    UNIQUE(USERNAME)
    );""")

#create target table
con.execute("""CREATE TABLE IF NOT EXISTS target (
    TARGET_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    USER_ID INTEGER NOT NULL,
    UPDATED_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
    ACITVE INTEGER NOT NULL,
    DIETSTYLE TEXT NOT NULL,
            
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
    );""")

#create calorie record table
con.execute("""CREATE TABLE IF NOT EXISTS calorie (
            C_RECORD_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            RECORD_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            USER_ID INTEGER NOT NULL,
            FOOD_ITEM TEXT,
            CALORIES INTEGER NOT NULL,
            PROTEIN_GRAM INTEGER,
            CARBS_GRAM INTEGER,
            FAT_GRAM INTEGER
            );""")

#create exercise record table
con.execute("""CREATE TABLE IF NOT EXISTS exercise (
            E_RECORD_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            RECORD_DATE TIMESTAMP DEFAULT CURRENTN_TIMESTAMP,
            USER_ID INTEGER NOT NULL,
            CALORIES INTEGER NOT NULL,
            HEARTRATE INTEGER
            );""")

#create weight record table
con.execute("""CREATE TABLE IF NOT EXISTS weight(
            WEIGHT_ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            RECORD_DATE TIMESTAMP DEFAULT CURRENTN_TIMESTAMP,
            USER_ID INTEGER NOT NULL,
            WEIGHT FLOAT NOT NULL,
            BODY_FAT FLOAT NOT NULL
);""")
    
#insert demo data
demoData_profile = [{'username': 'demo',
            'password': '1234',
            'name': 'Jacky'},
            
            {'username': 'ycclau',
            'password': '12345',
            'name': 'Chris Lau'}
            ]


for profile in demoData_profile:
    insertQuery = "INSERT INTO profile (USERNAME, PASSWORD, NAME) values (?,?,?);"
    con.execute(insertQuery,(profile['username'],profile['password'],profile['name']))

#insert target data into account demo
demo_bmr = 1600
demo_tdee = 1800
demo_proteinPercentage = 0.5
demo_carbsPercentage = 0.2
demo_fatPercentage = 0.3

demo_target = {
    'calorieIntake': demo_tdee,
    'style': 'Low Carbohydrates',
    'carbs':{
        'percentage': demo_carbsPercentage,
        'gram': demo_carbsPercentage*demo_tdee/4,
        'calorie': demo_carbsPercentage*demo_tdee,
    },
    'protein':{
        'percentage': demo_proteinPercentage,
        'gram': demo_proteinPercentage*demo_tdee/4,
        'calorie': demo_proteinPercentage*demo_tdee,
    },
    'fat':{
        'percentage': demo_fatPercentage,
        'gram': demo_fatPercentage*demo_tdee/9,
        'calorie': demo_fatPercentage*demo_tdee,
    },
}

demo_style = demo_target['style']
demo_carbs_gram = demo_target['carbs']['gram']
demo_carbs_cal = demo_target['carbs']['calorie']
demo_protein_gram = demo_target['protein']['gram']
demo_protein_cal = demo_target['protein']['calorie']
demo_fat_gram = demo_target['fat']['gram']
demo_fat_cal = demo_target['fat']['calorie']

con.execute("""INSERT INTO target (
        USER_ID,
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
    )
    VALUES (
        1,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    )""",
    (demo_bmr,
    demo_tdee, 
    demo_protein_gram, 
    demo_proteinPercentage, 
    demo_protein_cal,
    demo_carbs_gram,
    demo_carbsPercentage,
    demo_carbs_cal,
    demo_fat_gram,
    demo_fatPercentage,
    demo_fat_cal))

con.execute(
    """INSERT INTO calorie(
        USER_ID, 
        RECORD_DATE,
        FOOD_ITEM,
        CALORIES, 
        PROTEIN_GRAM, 
        CARBS_GRAM, 
        FAT_GRAM
    ) 
    VALUES 
        (1, "2023-11-17", "Cheese", 402.2, 1.3, 25, 33), 
        (1, "2023-11-17", "Cocoa Powder", 306, 25, 20, 14),
        (1, "2023-11-17", "Cesar Salad", 354, 14, 7, 30),
        (1, "2023-11-16", "Oyster", 201, 12, 9, 13),
        (1, "2023-11-15", "Egg Tart", 382.06, 52.06, 7.77, 15.86),
        (1, "2023-11-14", "Chia seeds", 379, 8, 17, 31),
        (1, "2023-11-14", "Bacon", 404.6, 0.4, 13, 39)"""
    )

con.commit()
con.close()