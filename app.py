from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# CORS 설정
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/create-post', methods=['POST'])
def create_post():
    data = request.get_json()
    # 여기서 데이터 처리를 수행합니다.
    response = {
        'message': 'POST 요청이 성공적으로 처리되었습니다.',
        'data': data
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=8000)
