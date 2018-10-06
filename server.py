from flask import Flask, jsonify, request

import connect
import qrcode
import base64
from io import BytesIO

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB limit

@app.before_first_request
def setup():
    connect.connectDb()

@app.route('/api/create_account')
def create_account():
    return 'Hello, World!'

@app.route('/api/get_patients')
def get_patients():
    print("got_message")
    return jsonify(connect.getPatients())
    
@app.route("/api/get_patient_by_id", methods=['GET'])
def get_patient():
    id = request.args.get('id')
    return jsonify(connect.getPatient(id))

@app.route("/api/get_patient_qr", methods=['GET'])
def get_patient_qr():
    id = request.args.get('id')
    qr = qrcode.make(str(id));
    buffered = BytesIO()
    qr.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue())
    result = {}
    result['image_string'] = str(img_str)
    return jsonify(result)
    
@app.route("/api/add_patient")
def add_patient():
    #core info
    firstName = request.args.get('firstName')
    lastName = request.args.get('lastName')
    isParent = request.args.get('isParent')
    parentId = request.args.get('parentId')
    isDoctor = request.args.get('isDoctor')
    doctorId = request.args.get('doctorId')
    startIndex = 5
    count = 0
    info = []
    for (keys, vals) in request.args.items():
        if(count >= startIndex):
            info.append(vals)
        count+= 1
    return jsonify(connect.addPatient(str(firstName), str(lastName), str(isParent), str(parentId), str(isDoctor), str(doctorId), info))

@app.route("/api/remove_patient", methods=['GET'])
def remove_patient():
    return jsonify(connect.delPatient(str(request.args.get('id'))))

@app.route("/api/submit_data", methods=['GET', 'POST'])
def submit_data():
    lastVal = 'doctorId'
    print("submitting")
    info = []
    firstName = ""
    lastName = ""
    keys = []
    for (key, val) in request.form.items():
        if key == 'firstName':
            firstName = val
        elif key == 'lastName':
            lastName = val
        elif key == 'stage':
            pass
        else:
            info.append(val)
            keys.append(key)
    print("done")
    connect.addPatient(firstName, lastName, "No", "", "No", "", info, keys)
    try:
        f = request.files['file']
        print(f)
        f.save("profilePics/" + f.filename)
    except:
        pass
    result = {}
    result['status'] = "Ok"
    return jsonify(result)

@app.route("/api/login")
def login():
    username = request.args.get('user')
    password = request.args.get('pass')
    result = {}
    if(connect.isUser(username, password)):
        result['status'] = "Ok"
    else:
        result['status'] = "No"
    print(result)
    return jsonify(result);

@app.route("/api/signup")
def signup():
    firstName = request.args.get("firstName")
    lastName = request.args.get("lastName")
    username = request.args.get("user")
    password = request.args.get("pass")
    result = {}
    connect.addAccount(firstName, lastName, username, password)
    result['status'] = "Ok"
    print(result)
    return jsonify(result)
    
    
    
    
    

