# -*- coding: utf-8 -*-
from flask import Flask,render_template
app=Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/board/<board_name>')
def board(board_name):
    return 'board:%s' % (board_name)
if __name__=='__main__':
    app.run('0.0.0.0')
