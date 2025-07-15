from flask import Flask, request, jsonify
import mysql.connector
import os

app = Flask(__name__)

# DB Config
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'admin'),
    'password': os.environ.get('DB_PASS', 'password'),
    'database': 'bankdb'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/balance', methods=['GET'])
def balance():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT balance FROM account WHERE id=1")
    balance = cursor.fetchone()[0]
    conn.close()
    return jsonify({'balance': balance})

@app.route('/deposit', methods=['POST'])
def deposit():
    amount = request.json['amount']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE account SET balance = balance + %s WHERE id=1", (amount,))
    conn.commit()
    conn.close()
    return jsonify({'message': f'${amount} deposited successfully'})

@app.route('/withdraw', methods=['POST'])
def withdraw():
    amount = request.json['amount']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE account SET balance = balance - %s WHERE id=1", (amount,))
    conn.commit()
    conn.close()
    return jsonify({'message': f'${amount} withdrawn successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
