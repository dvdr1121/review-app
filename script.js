const PROD_ORIGIN = "https://review-app-i0d4.onrender.com";
const API_BASE =
  window.location.origin.startsWith("file://") ? PROD_ORIGIN : "";

document.getElementById("generateBtn").addEventListener("click", async () => {
  // ...（入力の取得はそのまま）

  const simpleInput = `
担当スタッフ：${stylist}
メニュー：${menu}
良かったところ：${good}
${improve ? "気になった点：" + improve : ""}
お客様の一言：${shortText || "また利用したい"}
`.trim();

  const resultArea = document.getElementById("resultText");
  resultArea.value = "AIが口コミ文を作成しています…";

  try {
    const res = await fetch(`${API_BASE}/generate-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ simpleInput }),
    });
    if (!res.ok) {
      resultArea.value = "サーバーでエラーが起きました。時間をおいて再試行してください。";
      return;
    }
    const data = await res.json();
    resultArea.value = data.review || "口コミ文を生成できませんでした。";
    // ステップ2→3の切り替えがある場合
    document.getElementById("step2")?.classList.add("hidden");
    document.getElementById("step3")?.classList.remove("hidden");
  } catch (e) {
    console.error(e);
    resultArea.value = "サーバーに接続できませんでした。";
  }
});
