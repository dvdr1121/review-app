// Render上では相対パスでOK。ローカルfile://で開いた時だけ本番URLに飛ばす
const PROD_ORIGIN = "https://<あなたの新URL>.onrender.com";
const API_BASE = window.location.origin.startsWith("file://") ? PROD_ORIGIN : "";

const el = (id) => document.getElementById(id);

el("generateBtn")?.addEventListener("click", async () => {
  const good = el("good")?.value.trim();
  if (!good) return alert("良かったことを入力してください。");
  const result = el("resultText");
  result.value = "AIが口コミ文を作成しています…";

  try {
    const r = await fetch(`${API_BASE}/generate-review`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ simpleInput: good })
    });
    const data = await r.json();
    result.value = data.review || "生成に失敗しました。";
    // ステップ切替（ある場合）
    document.getElementById("step2")?.classList.add("hidden");
    document.getElementById("step3")?.classList.remove("hidden");
  } catch(e) {
    result.value = "サーバーに接続できませんでした。";
  }
});

el("copyBtn")?.addEventListener("click", () => {
  navigator.clipboard.writeText(el("resultText").value || "");
  alert("コピーしました！");
});
