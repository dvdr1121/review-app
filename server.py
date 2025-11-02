from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai

# .env読み込み
load_dotenv()

# OpenAI APIキー
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/generate-review", methods=["POST"])
def generate_review():
    data = request.get_json()

    service = data.get("rating_service")
    skill = data.get("rating_skill")
    atmosphere = data.get("rating_atmosphere")
    comment = data.get("comment", "")

    prompt = f"""
あなたは美容室を実際に利用したお客様として口コミを書くアシスタントです。
以下の来店アンケートをもとに、ホットペッパーに投稿できる自然な口コミ文を日本語で作成してください。

・接客の評価（5点満点）: {service}
・技術の評価（5点満点）: {skill}
・お店の雰囲気の評価（5点満点）: {atmosphere}
・お客様のコメント: {comment}

条件:
- だいたい100文字くらい
- ポジティブで読みやすい文章にする
- 絵文字や☆マークは使わない
- 「またお願いしたいです。」で終わる
"""

    try:
        completion = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "あなたは口コミ文を丁寧に整えるアシスタントです。"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )

        ai_text = completion.choices[0].message["content"].strip()

        return jsonify({"review": ai_text})

    except Exception as e:
        # ここでエラーの詳細を画面に出す！
        import traceback
        print("=== ERROR DETAILS ===")
        traceback.print_exc()
        print("=====================")

        return jsonify({
            "review": "",
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
