document.getElementById("generateBtn").addEventListener("click", () => {
    const stylist = document.getElementById("stylist").value;
    const menu = document.getElementById("menu").value;
    const good = document.getElementById("good").value;
    const improve = document.getElementById("improve").value;
    const shortText = document.getElementById("short").value;
  
    if (!stylist || !menu || !good) {
      alert("担当者・メニュー・良かったところを入力してください。");
      return;
    }
  
    const review = `
  先日、${menu}を担当していただいた${stylist}さんにお願いしました。
  ${good}
  ${improve ? "気になった点としては " + improve + " ですが、" : ""}
  全体的にとても満足しています。${shortText || "またお願いしたいです。"}
  `;
  
    document.getElementById("resultText").value = review.trim();
  });
  
  document.getElementById("copyBtn").addEventListener("click", () => {
    const text = document.getElementById("resultText").value;
    navigator.clipboard.writeText(text);
    alert("口コミ文をコピーしました！");
  });
  