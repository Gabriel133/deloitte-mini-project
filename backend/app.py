import flask
from flask import request, jsonify
from flask_cors import CORS
import sqlite3
import calendar

app = flask.Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404

@app.route('/', methods=['GET'])
def homep():
    return "<h1>Distant Reading Archive</h1><p>This site is a prototype API for distant reading of science fiction novels.</p>"

#Get transaction detail
@app.route('/api/gettrans', methods=['GET'])
def api_getTransList():
    tabledt = {
        "columns": [
            {
                "label": 'DATE',
                "field": 'TRAN_DATE',
                "sort": 'asc',
                "width": 150
            },
            {
                "label": 'INVESTOR',
                "field": 'INVESTOR',
                "sort": 'asc',
                "width": 150
            },
            {
                "label": 'AMOUNT',
                "field": 'AMOUNT',
                "sort": 'asc',
                "width": 150
            },
            {
                "label": 'INVESTOR TYPE',
                "field": 'INVESTOR_TYPE',
                "sort": 'asc',
                "width": 100
            },
            {
                "label": 'INVESTMENT TYPE',
                "field": 'INVESTMENT_TYPE',
                "sort": 'asc',
                "width": 150
            }
        ],
        "rows": []
    }
    company = request.args.get('investee')
    to_filter = [company]
    sqlQuery="""SELECT TRAN_DATE, INVESTOR, INVESTOR_TYPE, INVESTMENT_TYPE, AMOUNT
                FROM EV_MARKET_DATA
                WHERE INVESTEE=?
                ORDER BY TRAN_DATE DESC;"""
    tabledt["rows"] = retrieve_data(sqlQuery, to_filter)
    return jsonify(tabledt)

#Get investment detail group by month and year
@app.route('/api/gettransgrpbymthyr', methods=['GET'])
def api_getTransGrpByMthYr():
    company = request.args.get('investee')
    to_filter = [company]
    sqlQuery="""SELECT TOTAL_AMOUNT, (TRAN_MONTH || '-' || TRAN_YEAR) AS TRAN_DATE
                FROM(
                SELECT SUM(AMOUNT) AS TOTAL_AMOUNT, STRFTIME('%m',TRAN_DATE) AS TRAN_MONTH, STRFTIME('%Y',TRAN_DATE) AS TRAN_YEAR
                FROM EV_MARKET_DATA
                WHERE INVESTEE=?
                GROUP BY TRAN_MONTH, TRAN_YEAR
                ORDER BY TRAN_YEAR, TRAN_MONTH ASC);"""
    result = retrieve_data(sqlQuery, to_filter)
    for row in result:
        mth = row['TRAN_DATE'][:2]
        yr = row['TRAN_DATE'][3:]
        row['TRAN_DATE'] = calendar.month_name[int(mth)] + " " + yr
    return jsonify(result)

#List of investors
@app.route('/api/getinvestorsbycompany', methods=['GET'])
def api_getInvestorsByCompany():
    company = request.args.get('investee')
    to_filter = [company]
    sqlQuery="""SELECT INVESTOR, INVESTOR_TYPE, SUM(AMOUNT) AS TOTAL_AMOUNT 
                FROM EV_MARKET_DATA 
                WHERE INVESTEE=?
                GROUP BY INVESTOR, INVESTOR_TYPE
                ORDER BY TOTAL_AMOUNT DESC;"""
    return jsonify(retrieve_data(sqlQuery, to_filter))

#Top 3 investors by company
@app.route('/api/gettopinvestorsbycompany', methods=['GET'])
def api_getTop3InvestorsByCompany():
    company = request.args.get('investee')
    to_filter = [company]
    sqlQuery="""SELECT INVESTOR, INVESTOR_TYPE, SUM(AMOUNT) AS TOTAL_AMOUNT 
                FROM EV_MARKET_DATA 
                WHERE INVESTEE=?
                GROUP BY INVESTOR, INVESTOR_TYPE
                ORDER BY TOTAL_AMOUNT DESC LIMIT 3;"""
    return jsonify(retrieve_data(sqlQuery, to_filter))

#Get company portfolio
@app.route('/api/getcompanyportfolio', methods=['GET'])
def api_getCompanyPortfolio():
    company = request.args.get('investee')
    to_filter = [company]
    sqlQuery="""SELECT SUM(AMOUNT) AS TOTAL_AMOUNT, INVESTEE, COUNTRY
                FROM EV_MARKET_DATA
                WHERE INVESTEE=?
                GROUP BY INVESTEE, COUNTRY;"""
    return jsonify(retrieve_data(sqlQuery, to_filter))

#Get company
@app.route('/api/getcompanies', methods=['GET'])
def api_getCompanies():
    tabledt = {
        "columns": [
            {
                "label": 'ACTION',
                "field": 'DTL_LINK',
                "sort": 'asc',
                "width": 150
            },
            {
                "label": 'COMPANY',
                "field": 'INVESTEE',
                "sort": 'asc',
                "width": 150
            },
            {
                "label": 'MARKET CAP.',
                "field": 'MARKET_CAP',
                "sort": 'asc',
                "width": 100
            },
            {
                "label": 'COUNTRY',
                "field": 'COUNTRY',
                "sort": 'asc',
                "width": 150
            }
        ],
        "rows": []
    }
    company = request.args.get('investee')
    to_filter = []
    sqlQuery="""SELECT INVESTEE, COUNTRY, SUM(AMOUNT) AS MARKET_CAP
                FROM EV_MARKET_DATA
                GROUP BY INVESTEE, COUNTRY
                ORDER BY INVESTEE ASC;"""
    if company:
        to_filter.append(company)
        sqlQuery="""SELECT INVESTEE, COUNTRY, SUM(AMOUNT) AS MARKET_CAP
                    FROM EV_MARKET_DATA
                    WHERE INVESTEE=?
                    GROUP BY INVESTEE, COUNTRY
                    ORDER BY INVESTEE ASC;"""
        tabledt["rows"] = retrieve_data(sqlQuery, to_filter)
        return jsonify(tabledt)
    else:
        tabledt["rows"] = retrieve_data(sqlQuery)
        return jsonify(tabledt)

#Total amount by month (most recent year)
@app.route('/api/getttlamtbymth', methods=['GET'])
def api_getTtlAmtByMth():
    sqlQuery="""SELECT SUM(AMOUNT) AS TOTAL_AMOUNT, STRFTIME('%m',TRAN_DATE) AS TRAN_MONTH, STRFTIME('%Y',TRAN_DATE) AS TRAN_YEAR
                FROM EV_MARKET_DATA
                WHERE STRFTIME('%Y',TRAN_DATE) = (
                    SELECT STRFTIME('%Y',TRAN_DATE) AS TRAN_YEAR 
                    FROM EV_MARKET_DATA
                    ORDER BY TRAN_DATE DESC
                    LIMIT 1
                )
                GROUP BY TRAN_YEAR, TRAN_MONTH
                ORDER BY TRAN_MONTH ASC;"""
    result = retrieve_data(sqlQuery)
    #Change month from number to name
    for row in result:
        mth = row['TRAN_MONTH']
        row['TRAN_MONTH'] = calendar.month_name[int(mth)]
    return jsonify(result)

#Total amount by years (Recent 5)
@app.route('/api/getttlamtbyyrs', methods=['GET'])
def api_getTtlAmtByYears():
    sqlQuery = """SELECT * FROM (SELECT SUM(AMOUNT) AS TOTAL_AMOUNT, TRAN_YEAR
                FROM (
                    SELECT AMOUNT, STRFTIME('%Y',TRAN_DATE) AS TRAN_YEAR 
                    FROM EV_MARKET_DATA
                )
                GROUP BY TRAN_YEAR
                ORDER BY TRAN_YEAR DESC
                LIMIT 5) ORDER BY TRAN_YEAR ASC;"""
    return jsonify(retrieve_data(sqlQuery))

#Top 5 investors
@app.route('/api/gettopinvestors', methods=['GET'])
def api_getTop5Investors():
    sqlQuery = 'SELECT INVESTOR, SUM(AMOUNT) AS TOTAL_AMOUNT FROM EV_MARKET_DATA GROUP BY INVESTOR ORDER BY TOTAL_AMOUNT DESC LIMIT 5;'
    return jsonify(retrieve_data(sqlQuery))

#Top 5 companies
@app.route('/api/gettopcompanies', methods=['GET'])
def api_getTop5Companies():
    sqlQuery = 'SELECT INVESTEE, SUM(AMOUNT) AS TOTAL_AMOUNT FROM EV_MARKET_DATA GROUP BY INVESTEE ORDER BY TOTAL_AMOUNT DESC LIMIT 5;'
    return jsonify(retrieve_data(sqlQuery))

#Top 3 companies by country
@app.route('/api/gettopcompanybycountries', methods=['GET'])
def api_getTopCompanyByCountries():
    result = []
    topCountries = getTop3Counties()
    for row in topCountries:
        country = row['COUNTRY']
        tempDic = {
            'Country': country
        }
        tempDic['Companies'] = getTopCompanyByCountry(country)
        result.append(tempDic)
    
    return jsonify(result)

def getTopCompanyByCountry(country):
    to_filter = []
    if country:
        to_filter.append(country)
    sqlQuery = 'SELECT INVESTEE, SUM(AMOUNT) AS TOTAL_AMOUNT FROM EV_MARKET_DATA WHERE COUNTRY=? GROUP BY INVESTEE ORDER BY TOTAL_AMOUNT DESC LIMIT 3;'
    return retrieve_data(sqlQuery, to_filter)

#Get total amount by countries group by years
@app.route('/api/getcountriesttlbyyear', methods=['GET'])
def api_getTotalAmountByCountriesGroupByYears():
    sqlQuery = """SELECT STRFTIME('%Y',TRAN_DATE) AS TRAN_YEAR, COUNTRY, SUM(AMOUNT)/1000000 AS TOTAL_AMOUNT 
                FROM EV_MARKET_DATA 
                WHERE TRAN_YEAR > date('now','start of year', '-8 years')
                GROUP BY TRAN_YEAR, COUNTRY
                ORDER BY TRAN_YEAR ASC;"""
    result = retrieve_data(sqlQuery)
    tempDic = {}
    tempYr = ''
    dtlLs = []
    count = 0
    #Pivot result by Python
    for row in result:
         if row['TRAN_YEAR'] != tempYr:
             if tempDic != {}:
                 dtlLs.append(tempDic)
             tempDic = {}
             tempYr = row['TRAN_YEAR']
             tempDic['TRAN_YEAR'] = tempYr
         tempDic[row['COUNTRY']] = row['TOTAL_AMOUNT']
         count += 1
         #to get the last year record
         if count == len(result):
             if tempDic != {}:
                 dtlLs.append(tempDic)

    return jsonify(dtlLs)

#Total amount invested by countries
@app.route('/api/getttlamtbycountries', methods=['GET'])
def api_getTotalAmountByCountries():
    sqlQuery = 'SELECT COUNTRY, SUM(AMOUNT) AS TOTAL_AMOUNT FROM EV_MARKET_DATA GROUP BY COUNTRY ORDER BY TOTAL_AMOUNT DESC;'
    return jsonify(retrieve_data(sqlQuery))

#Get top 3 countries
@app.route('/api/gettop3countries', methods=['GET'])
def api_getTop3Counties():
    return jsonify(getTop3Counties())

def getTop3Counties():
    sqlQuery = 'SELECT COUNTRY, SUM(AMOUNT) AS TOTAL_AMOUNT FROM EV_MARKET_DATA GROUP BY COUNTRY ORDER BY TOTAL_AMOUNT DESC LIMIT 3;'
    return retrieve_data(sqlQuery)

@app.route('/api/getall', methods=['GET'])
def api_getAll():
    sqlQuery = 'SELECT * FROM EV_MARKET_DATA;'
    return jsonify(retrieve_data(sqlQuery))

@app.route('/api/get', methods=['GET'])
def api_filter():
    query_parameters = request.args

    investee = query_parameters.get('investee')
    tranDate = query_parameters.get('trandate')
    investmentType = query_parameters.get('investmenttype')
    investmentType = query_parameters.get('investmenttype')
    country = query_parameters.get('country')
    investor = query_parameters.get('investor')
    investorType = query_parameters.get('investortype')

    query = "SELECT * FROM EV_MARKET_DATA WHERE"
    to_filter = []

    if investee:
        query += ' INVESTEE=? AND'
        to_filter.append(investee)
    if tranDate:
        query += ' TRAN_DATE=? AND'
        to_filter.append(tranDate)
    if investmentType:
        query += ' INVESTMENT_TYPE=? AND'
        to_filter.append(investmentType)
    if country:
        query += ' COUNTRY=? AND'
        to_filter.append(country)
    if investor:
        query += ' INVESTOR=? AND'
        to_filter.append(investor)
    if investorType:
        query += ' INVESTOR_TYPE=? AND'
        to_filter.append(investorType)
    if not (investee or tranDate or investmentType or country or investor or investorType):
        return page_not_found(404)

    query = query[:-4] + ';'

    results = retrieve_data(query, to_filter)

    return jsonify(results)

def retrieve_data(query, filter=''):
    conn = sqlite3.connect('datasrc.db')
    conn.row_factory = dict_factory
    cur = conn.cursor()
    if filter != '':
        return cur.execute(query, filter).fetchall()
    return cur.execute(query).fetchall()

# comment app.run() to fix Azure issue
app.run()