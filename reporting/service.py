#!/usr/bin/env python

import uuid
import json
import sqlite3
from urllib.parse import urlparse
from flask import Flask, make_response, request, g
app = Flask(__name__)


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect('reports.db')
        g.db.row_factory = sqlite3.Row
        init_db(g.db)
    return g.db


def init_db(db):
    c = db.cursor()
    c.execute('''create table if not exists csp_reports
                 (id integer primary key asc,
                  req_id,
                  policy,
                  violated_directive,
                  report)''')


@app.route('/', methods=['POST'])
def report():
    report = request.get_json().get('csp-report', {})
    doc_uri = report.get('document-uri')

    uri = urlparse(doc_uri)
    reqid = uuid.uuid4().hex

    db = get_db()
    c = db.cursor()
    c.execute('''insert into csp_reports (req_id, policy, violated_directive, report)
                 values (?, ?, ?, ?)''', (
                     reqid,
                     report.get('original-policy', None),
                     report.get('violated-directive', None),
                     json.dumps(report)))
    db.commit()

    resp = make_response()
    resp.set_cookie('csp-req-id', reqid, path=uri.path)
    return resp


@app.route('/results', methods=['GET'])
def results():
    c = get_db().cursor()
    c.execute('select * from csp_reports')
    res = c.fetchall()
    print(res)
    return json.dumps(res)


@app.teardown_appcontext
def teardown_db(ctx):
    db = g.pop('db', None)

    if db is not None:
        db.close()
