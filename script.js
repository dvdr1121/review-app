// ✅ API接続URLの設定（Render本番とローカルの両方対応）
const API_BASE = 
  location.origin.includes("onrender.com") ? "" : "https://review-app-i0d4.onrender.com";

function nextStep() {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");
}

function prevStep() {
  document.getElementById("step2").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
}

function restart() {
  document.getElementById("step3").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("resultText").value = "";
  document.getElementById("comment").value = "";
}

async function generateReview() {
  const service = document.getElementById("rating_service").value;
  const skill = document.getElementById("rating_skill").value;
  const atmosphere = document.getElementById("rating_atmosphere").value;
  const comment = document.getElementById("comment").value.trim();
  const resultBox = document.getElementById("resultText");

  resultBox.value = "AIが口コミを作成中です…";

  // ✅ サーバー側が受け取る形式に合わせて simpleInput にまとめる
  const simpleInput =
    `接客:${service} 技術:${skill} 雰囲気:${atmosphere}。一言: ${comment || "特になし"}`;

  try {
    const response = await fetch(`${API_BASE}/generate-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ simpleInput }),
    });

    if (!response.ok) {
      resultBox.value = "エラーが発生しました。";
      document.getElementById("step2").classList.add("hidden");
      document.getElementById("step3").classList.remove("hidden");
      return;
    }

    const data = await response.json();
    resultBox.value = data.review || "口コミ文を生成できませんでした。";

    // ✅ ステップを進める
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");

  } catch (err) {
    console.error(err);
    resultBox.value = "サーバーに接続できませんでした。";
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.remove("hidden");
  }
}

function copyText() {
  const text = document.getElementById("resultText").value;
  navigator.clipboard.writeText(text);
  alert("口コミ文をコピーしました！");
}
