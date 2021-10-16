from flask import Flask, render_template, request, redirect, url_for, session
from flask_pymongo import PyMongo
from flask_session import Session
from functools import wraps
import re

app = Flask(__name__)
ses = Session()
app.config["MONGO_URI"] = "mongodb://localhost:27017/dgstore"

# designed to extract username from email using regular expression
def get_user_name(email):
    try:
        user_name = re.search('(.+?)@gmail.com', email).group(1)
        return user_name
    except AttributeError:
        user_name = ''
        return user_name

@app.route("/signup", methods=["GET","POST"])
def signup():
    session.clear()
    # creating instance of pymongo class
    ins = PyMongo(app=app)
    if request.method == "POST":
        user_email = request.form["useremail"]
        user_password = request.form["userpassword"]

        # admin login
        if user_email == "admin@deepsgamingstore.com" and user_password == "admin@dgs":
            session['email'] = user_email
            return redirect(url_for("adminpanel", name="admin"))
        
        session.clear()
        user = ins.db.users.find_one({'email':user_email, 'password': user_password})
        if user is not None and user['email'] == user_email and user['password'] == user_password:
            # existing user login check inside `users` document
            session['email'] = user_email
            return redirect(url_for("store", username=get_user_name(user_email)))    
        else:
            # insert email and password for onetime signup => `users` document
            ins.db.users.insert_one({'email':user_email, 'password': user_password})
            session['email'] = user_email
            # redirect to store/user endpoint along with username
            return redirect(url_for("store", username=get_user_name(user_email)))

    return render_template("signup.html")

def login_required(f):
    @wraps(f)
    def dec_function(*args, **kwargs):
        if session.get('email') is None:
            return redirect('/signup', code=302)
        return f(*args, **kwargs)
    return dec_function 


@app.route("/store/user/<username>", methods=["GET","POST"])
@login_required
def store(username):
    ins = PyMongo(app=app)
    products = ins.db.products.find()

    if request.method == "POST":
        purchased_info = request.get_json()
        
        # insert purchased products by user into `purchases` document
        ins.db.purchases.insert_one({'username': username, 'email': username+"@gmail.com", 'purchased': purchased_info['purchased']})
        # return render_template("store.html", context={"username":username, "products":products})

    return render_template("store.html", context={"username":username, "products":products})


@app.route("/adminpanel/<name>", methods=["GET","POST"])
@login_required
def adminpanel(name):
    ins = PyMongo(app=app)
    purchases = ins.db.purchases.find()
    purchases_length = ins.db.purchases.estimated_document_count()
    context={"username":name, "purchases":purchases, "purchases_length": purchases_length}
    return render_template("admin.html", context=context)

@app.route("/logout/<username>", methods=["GET","POST"])
@login_required
def logout(username):
    session.clear()
    print(username)    
    return redirect(url_for("signup"))    

@app.route("/deleteaccount/<username>")
@login_required
def delete_account(username):
    ins = PyMongo(app=app)
    ins.db.users.delete_one({'email': username+"@gmail.com"})
    return redirect(url_for("signup"))

if "__main__" == __name__:
    app.secret_key = '$deep@gaming#store!'
    app.config['SESSION_TYPE'] = 'filesystem'    
    ses.init_app(app)
    app.run(debug=True)