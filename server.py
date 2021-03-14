#!/usr/bin/env python3

from flask import Flask, render_template, request, make_response, jsonify, session, redirect, url_for
from igramscraper.instagram import Instagram
import json
import os
from datetime import datetime

app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY'] = 'mysecret'

instagram = Instagram()
curr_account = None

DEFAULT_VALUE_STORY = 5

@app.route('/winner')
def winner():
    #return render_template('winner.html', data = data_randomize if data_randomize != None else None)
    return render_template('winner.html', data=data_randomize)

@app.route('/post_insta_credentials', methods=["POST"])
def getCredentials():
    data = json.loads(request.data)

    instagram.with_credentials(data["username"], data["password"])
    instagram.login()

    global curr_account
    curr_account = instagram.get_account(instagram.session_username)

    response_data = {"followed_by": curr_account.followed_by_count, "follows": curr_account.follows_count}
    return make_response_ajax(True, False, response_data)

@app.route('/post_insta_post_code', methods=["POST"])
def get_ig_post_code():
    data = json.loads(request.data)
    if(curr_account == None):
        return make_response_ajax(False, True, "Please Log In with crendetials first")

    comments = {}
    #post1 = instagram.get_all_comments_for_a_post(data["ig_post_code"])
    post1 = instagram.get_media_comments_by_code(data["ig_post_code"], 1000)
    max_timestamp = datetime(2021, 3, 12, 23, 59, 59).timestamp() #create a timestamp for the limit of the concours
    for comm in post1['comments']:
        if(comm.created_at < max_timestamp):
            username = comm.owner.username
            comments[username] = comments[username] + 1 if username in comments else 1

    global data_randomize
    data_randomize = []

    for username in comments:
        data_randomize.append({"username": username, "comments": comments[username], "story": True if ((stories is not None) and (username in stories)) else False})

    return make_response_ajax(True, False, data_randomize)

@app.route('/post_stories', methods=["POST"])
def get_stories_username():
    if request.files:
        data = request.files["story_file"]

        curr_directory = (os.path.realpath(__file__)).replace(os.path.basename(__file__), "")
        tmp = curr_directory + "/tmp"
        if not os.path.isdir(tmp):
            os.mkdir(tmp)

        saved_file = os.path.join(tmp, data.filename)
        data.save(saved_file)

        global stories

        with open(saved_file) as f:
            stories = f.readlines()
        # you may also want to remove whitespace characters like `\n` at the end of each line
        stories = [x.strip() for x in stories]

        global data_randomize
        if data_randomize != None:
            for username in stories:
                for comm in data_randomize:
                    if(comm['username'] == username):
                        comm['story'] = True
                        break

        return make_response_ajax(True, False, data_randomize)

    return make_response_ajax(False, True, "No Data !")

data_randomize = None
stories = None

@app.route('/randomize', methods=['POST'])
def randomize():
    global data_randomize
    data_randomize = json.loads(request.form['txt_area_json'])

    cummul = 0
    if stories != None:
        for username in stories:
            for comm in data_randomize:
                if(comm['username'] == username):
                    comm['story'] = True

    for comm in data_randomize:
        cummul += int(comm['comments'])
        if comm["story"]:
            cummul += DEFAULT_VALUE_STORY
        comm['cummul'] = cummul

    return render_template('winner.html', data=data_randomize)



@app.route('/')
def index():
    return render_template('index.html')

def make_response_ajax(success, error, data):
    response = make_response(
        jsonify(
            {'success': success, 'error': error, 'data': data}
        ),
        200,
    )
    response.headers["Content-Type"] = "application/json"
    return response

if __name__ == "__main__":
    app.run(port=13226, host='0.0.0.0')
