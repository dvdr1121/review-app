from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

# 🟢 これを追加（index.htmlを表示するルート）
@app.route("/")
def serve_index():
    return send_from_directory(".", "index.html")

@app.route("/generate-review", methods=["POST"])
def generate_review():
    data = request.get_json()
    simple_input = data.get("simpleInput", "")

    prompt_text = f"""
あなたは美容室のお客様です。
下記の感想をもとに、自然で感じの良い口コミ文を日本語で書いてください。
ホットペッパーに投稿する想定で、100文字前後にまとめてください。
絵文字や☆マークは使わないでください。

【感想】{simple_input}
"""

    completion = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "あなたはお客様として口コミを自然に書くアシスタントです。"},
            {"role": "user", "content": prompt_text}
        ],
        temperature=0.7,
    )

    ai_review_text = completion.choices[0].message["content"].strip()
    return jsonify({"review": ai_review_text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
