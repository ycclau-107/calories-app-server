# calories-app

## 1. Remove existing database(optional)
To prevent any potential error with previous records, you may want to remove the existing database(if any) in your directory:

```
rm -f ./calorie-db.db
```

## 2. Initialize server and database
To initialize the server and the database, user can execute the following combined command:

python3:
```
python3 ./server/database.py && python3 ./server/server.py
```

python:
```
python ./server/database.py && python ./server/server.py
```

The following code should be shown after the executions:

```
 * Serving Flask app 'server'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on {LocalServerIP}
 * Running on {PublicServerIP}
Press CTRL+C to quit
```

## 3. Let the application connect to the server
you should store the {PublicServerIP} to the calories-app/serverConfig.js for the item {serverIP}
and change the serverMode to "online" to enable the connectivity between applicaiton and server.
