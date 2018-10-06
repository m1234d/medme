import _mysql as sql
import MySQLdb as mysql
global db

def connectDb():
    global db
    db = mysql.connect("35.238.81.179", "root", "masterpass123", "medme")

def getPatients():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM medme.patient_info")
    num_fields = len(cursor.description)
    field_names = [i[0] for i in cursor.description]
    rows = cursor.fetchall()
    result = {}
    result['rows'] = []
    for row in rows:
        value = {}
        for i in range(len(field_names)):
            value[field_names[i]] = row[i]
        result['rows'].append(value)
    cursor.close()
    return result
    
def getPatient(id):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM medme.patient_info WHERE id=" + str(id))
    num_fields = len(cursor.description)
    field_names = [i[0] for i in cursor.description]
    rows = cursor.fetchall()
    result = {}
    result['rows'] = []
    for row in rows:
        value = {}
        for i in range(len(field_names)):
            value[field_names[i]] = row[i]
        result['rows'].append(value)
    cursor.close()

    return result
def addPatient(firstName, lastName, isParent, parentId, isDoctor, doctorId, info, keys):
    cursor = db.cursor()
    queryString = "INSERT INTO medme.patient_info (firstName, lastName, isParent, parentId, isDoctor, doctorId"
    for item in keys:
        queryString += ", " + item
        
    queryString += ") VALUES ('" + firstName + "','" + lastName + "','" + isParent + "','" + parentId + "','" + isDoctor + "','" + doctorId + "'"
    for item in info:
        queryString += ",'" + item + "'"
    queryString += ")"
    print(queryString)
    cursor.execute(queryString)
    result = {}
    result['status'] = "Ok"
    db.commit()
    cursor.close()

    return result

def delPatient(id):
    cursor = db.cursor()
    cursor.execute("DELETE FROM medme.patient_info WHERE id=" + str(id))
    db.commit()
    result = {}
    result['status'] = "Ok"

    cursor.close()
    return result

def addColumn(key, lastItem):
    cursor = db.cursor()
    queryString = "ALTER TABLE medme.patient_info ADD COLUMN " + key + " VARCHAR(45) NULL AFTER " + lastItem + ""
    print(queryString)
    cursor.execute(queryString)
    result = {}
    result['status'] = "Ok"
    db.commit()
    cursor.close()

    return result

def isUser(user, password):
    cursor = db.cursor()
    queryString = "SELECT * FROM medme.patient_info WHERE username='" + user + "' and pass='" + password + "'"
    print(queryString)
    cursor.execute(queryString)
    rows = cursor.fetchall()
    print(len(rows))
    cursor.close()
    if len(rows) > 0:
        return True
    else:
        return False
    
def addAccount(firstName, lastName, username, password):
    cursor = db.cursor()
    queryString = "INSERT INTO medme.patient_info (username, pass, firstName, lastName, isParent) VALUES ('" + username + "', '" + password + "', '" + firstName + "', '" + lastName + "', 'Yes')"
    print(queryString)
    cursor.execute(queryString)
    db.commit()
    cursor.close()
    






















