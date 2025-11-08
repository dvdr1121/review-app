// 本番URL自動切替（file:// で開いた時は Render に飛ばす）
const PROD_ORIGIN = "https://review-app-i0d4.onrender.com";
const API_BASE = window.location.origin.startsWith("file://") ? PROD_ORIGIN : "";

// DOMヘルパ
const el = (id) => document.getElementById(id);
const show = (id) => { const s = el(id); if (s) s.style.display = "block"; };
const hide = (id) => { const s = el(id); if (s) s.style.display = "none"; };

async function generateReview() {
  const stylist   = el("stylist")?.value.trim();
  const menu      = el("menu")?.value.trim();
  const good      = el("good")?.value.trim();
  const improve   = el("improve")?.value.trim();
  const shortText = el("short")?.value.trim();
  const resultBox = el("resultText");

  if (!stylist || !menu || !good) {
    alert("担当者・メニュー・良かったところを入力してください。");
    return;
  }

  const simpleInput = `
担当スタッフ：${stylist}
メニュー：${menu}
良かったところ：${good}
${improve ? "気になった点：" + improve : ""}
お客様の一言：${shortText || "また利用したい"}
`.trim();

  // 作成中表示
  if (resultBox) resultBox.value = "AIが口コミ文を作成しています…";

  try {
    console.log("POST", `${API_BASE}/generate-review`, { simpleInput });
    const res = await fetch(`${API_BASE}/generate-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ simpleInput }),
    });
    console.log("STATUS", res.status);

    if (!res.ok) {
      const txt = await res.text();
      console.error("Response not OK", txt);
      if (resultBox) resultBox.value = "サーバーでエラーが起きました。時間をおいてもう一度お試しください。";
    } else {
      const data = await res.json();
      if (resultBox) resultBox.value = data.review || "口コミ文を生成できませんでした。";
    }
  } catch (e) {
    console.error("Fetch error", e);
    if (resultBox) resultBox.value = "サーバーに接続できませんでした。ネット接続やURLを確認してください。";
  }

  // 成否に関わらず必ずステップ3を表示
  hide("step1"); hide("step2"); show("step3");
}

// ボタン
el("generateBtn")?.addEventListener("click", generateReview);
el("copyBtn")?.addEventListener("click", () => {
  const text = el("resultText")?.value || "";
  navigator.clipboard.writeText(text);
  alert("口コミ文をコピーしました！");
});

// もう一度ボタン（ある場合）
el("restartBtn")?.addEventListener("click", () => {
  show("step1"); hide("step2"); hide("step3");
  if (el("resultText")) el("resultText").value = "";
});
