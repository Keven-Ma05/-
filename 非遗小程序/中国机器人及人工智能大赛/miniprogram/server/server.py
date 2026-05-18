from flask import Flask, request, jsonify
from volcenginesdkarkruntime import Ark
import os
import json
import sys

app = Flask(__name__)

DEV_API_KEY = "ark-413cfebe-4090-4208-acb3-e80b594fa73f-307f1"

api_key = os.getenv("ARK_API_KEY")
if not api_key:
    config_path = os.path.join(os.path.dirname(__file__), "config.json")
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            cfg = json.load(f)
            api_key = cfg.get("ARK_API_KEY", "")
    if not api_key:
        print("[警告] 未设置环境变量 ARK_API_KEY，使用开发用默认 Key（仅限本地测试）")
        api_key = DEV_API_KEY

client = Ark(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=api_key
)

@app.route("/generate-image", methods=["POST"])
def make_img():
    data = request.get_json(force=True)
    p = data.get("prompt", "")

    if not p.strip():
        return jsonify({"code": 400, "message": "prompt 不能为空"}), 400

    try:
        res = client.images.generate(
            model="doubao-seedream-4-0-250828",
            prompt=p,
            size="2K",
            response_format="url"
        )
        return jsonify({
            "code": 200,
            "imageUrl": res.data[0].url
        })
    except Exception as e:
        return jsonify({
            "code": 500,
            "message": f"生成失败: {str(e)}"
        }), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/recombine-culture", methods=["POST"])
def recombine_culture():
    data = request.get_json(force=True)
    elem_a = data.get("elemA", {})
    elem_b = data.get("elemB", {})

    name_a = elem_a.get("name", "")
    name_b = elem_b.get("name", "")
    keywords_a = elem_a.get("keywords", "")
    keywords_b = elem_b.get("keywords", "")

    if not name_a or not name_b:
        return jsonify({"code": 400, "message": "请提供两个文化元素"}), 400

    prompt = f"""创作一幅融合了中国{name_a}和{name_b}两种文化元素的全新艺术作品。
具体要求：
1. 将{keywords_a}的核心视觉特征
2. 与{keywords_b}的核心视觉特征
3. 进行有创意且和谐的艺术融合
4. 保持中国传统美学的整体基调
5. 画面构图精美、色彩协调、细节丰富
请生成一张高质量的中国传统文化融合艺术作品。"""

    try:
        res = client.images.generate(
            model="doubao-seedream-4-0-250828",
            prompt=prompt,
            size="2K",
            response_format="url"
        )
        return jsonify({
            "code": 200,
            "imageUrl": res.data[0].url,
            "prompt": prompt
        })
    except Exception as e:
        return jsonify({
            "code": 500,
            "message": f"文化融合生成失败: {str(e)}"
        }), 500

if __name__ == "__main__":
    print(f"服务器启动成功 → http://localhost:5000")
    print(f"接口地址 → POST http://localhost:5000/generate-image")
    print(f"接口地址 → POST http://localhost:5000/recombine-culture")
    app.run(host="0.0.0.0", port=5000)
