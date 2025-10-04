function setStatus(message, state) {
  const status = document.getElementById("statusMessage");

  if (!status) {
    return;
  }

  if (!message) {
    status.textContent = "";
    status.hidden = true;
    status.removeAttribute("data-state");
    return;
  }

  status.textContent = message;
  status.dataset.state = state;
  status.hidden = false;
}

function revealOutput() {
  const outputPanel = document.getElementById("output");

  if (outputPanel) {
    outputPanel.classList.remove("is-hidden");
  }
}

function hideOutput() {
  const outputPanel = document.getElementById("output");

  if (outputPanel) {
    outputPanel.classList.add("is-hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("generatorForm");
  const urlInput = document.getElementById("urlInput");
  const code1 = document.getElementById("code1");
  const code2 = document.getElementById("code2");

  if (!form || !urlInput || !code1 || !code2) {
    console.warn("必要な DOM 要素が見つかりませんでした。");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = urlInput.value.trim();

    if (!input) {
      setStatus("URL を入力してください", "error");
      hideOutput();
      return;
    }

    code1.textContent = `CODEX_REDIRECT_URL="${input}"`;
    code2.textContent = `curl -sL "$CODEX_REDIRECT_URL" > /dev/null`;
    revealOutput();
    setStatus("コードを生成しました。必要に応じてコピーしてください。", "success");
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-copy");
      const targetNode = targetId ? document.getElementById(targetId) : null;

      if (!targetNode) {
        setStatus("コピー対象を特定できませんでした。", "error");
        return;
      }

      const text = targetNode.textContent;

      navigator.clipboard
        .writeText(text)
        .then(() => {
          const label = button.getAttribute("data-label") || "コピー";
          setStatus(`${label}が完了しました。`, "success");
        })
        .catch(() => {
          setStatus("コピーに失敗しました。ブラウザの設定をご確認ください。", "error");
        });
    });
  });
});
