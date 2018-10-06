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

def getChildrenArray(id):
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
        result['rows'].append(value['children'])
    cursor.close()

    return result['rows'][0]

def addChildrenArray(id, array):

    cursor = db.cursor()
    queryString = "UPDATE medme.patient_info SET children = '" + array + "' WHERE (id = '" + id + "')"

    print(queryString)
    cursor.execute(queryString)
    result = {}
    result['status'] = "Ok"
    db.commit()
    cursor.close()

    return result
    
def addPatient(id, firstName, lastName, isParent, parentId, isDoctor, doctorId, info, keys):
    print(info)
    print(keys)
    cursor = db.cursor()
    queryString = "UPDATE medme.patient_info SET "
    queryString += "" + keys[0] + " = '" + info[0] + "'"
    for i in range(1, len(info)):
        queryString += ", " + keys[i] + " = '" + info[i] +"'"
    # queryString = "INSERT INTO medme.patient_info (firstName, lastName, isParent, parentId, isDoctor, doctorId"
    # for item in keys:
    #     queryString += ", " + item
    #     
    # queryString += ") VALUES ('" + firstName + "','" + lastName + "','" + isParent + "','" + parentId + "','" + isDoctor + "','" + doctorId + "'"
    # for item in info:
    #     queryString += ",'" + item + "'"
    # queryString += ")"
    queryString += " WHERE (id =  '" + id + "')"
    print(queryString)
    cursor.execute(queryString)
    result = {}
    result['status'] = "Ok"
    db.commit()
    cursor.close()

    return result
def getParent(id):
    cursor = db.cursor()
    queryString = "SELECT * from medme.patient_info WHERE id=" + str(id)
    cursor.execute(queryString)
    num_fields = len(cursor.description)
    field_names = [i[0] for i in cursor.description]
    rows = cursor.fetchall()
    result = {}
    result['rows'] = []
    for row in rows:
        value = {}
        for i in range(len(field_names)):
            value[field_names[i]] = row[i]
        print(value)
        result['rows'].append(value['parentId'])
    cursor.close()
    return result['rows'][0]
    
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
        isParent = rows[0][5]
        isDoctor = rows[0][7]
        if isParent == "Yes":
            return (rows[0][0], "parent")
        elif isDoctor == "Yes":
            return (rows[0][0], "doctor")
        else:
            return(rows[0][0], "child")
    else:
        return False
    
def addAccount(firstName, lastName, username, password):
    cursor = db.cursor()
    queryString = "INSERT INTO medme.patient_info (username, pass, firstName, lastName, isParent) VALUES ('" + username + "', '" + password + "', '" + firstName + "', '" + lastName + "', 'Yes')"
    print(queryString)
    cursor.execute(queryString)

    db.commit()
    cursor.close()
    
def addChildAccount(firstName, lastName, username, password, parentId):
    cursor = db.cursor()
    queryString = "INSERT INTO medme.patient_info (username, pass, firstName, lastName, isParent, parentId) VALUES ('" + username + "', '" + password + "', '" + firstName + "', '" + lastName + "', 'No', '" + parentId + "')"
    print(queryString)
    cursor.execute(queryString)
    db.commit()
    cursor.close()
    cursor = db.cursor()
    queryString = "SELECT * FROM medme.patient_info WHERE username='" + username + "' and pass='" + password + "'"
    print(queryString)
    cursor.execute(queryString)
    num_fields = len(cursor.description)
    field_names = [i[0] for i in cursor.description]
    rows = cursor.fetchall()
    result = {}
    result['rows'] = []
    for row in rows:
        value = {}
        for i in range(len(field_names)):
            value[field_names[i]] = row[i]
        print(value)
        result['rows'].append(value['id'])
    cursor.close()
    id = result['rows'][0]
    parentId = getParent(id)
    s = getChildrenArray(parentId)
    if s == None:
        s = ""
    array = s.split(",")
    print(array)
    if(array[0] == ''):
        array[0] = str(id)  
    else:
        array.append(str(id))
    s = ','.join(array)
    addChildrenArray(parentId, s)
    return id






















