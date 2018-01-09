# -*- coding: utf-8 -*-
from flask import Flask,render_template
app=Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/ocr')
def ocr():
    return render_template('ocr.html')
@app.route('/face')
def face():
    return render_template('face.html')
@app.route('/questions')
def questions():
    return render_template('questions.html')
@app.route('/topics')
def topics():
    return render_template('topics.html')

@app.route('/board/<board_name>')
def board(board_name):
    return render_template('/board/%s.html' % (board_name))
if __name__=='__main__':
    app.run('0.0.0.0')
