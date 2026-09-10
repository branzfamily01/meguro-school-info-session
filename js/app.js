/*
  学校説明会特設サイト 設定ファイル
  詳細確定後は、まずこの SITE_CONFIG を更新してください。
*/
const SITE_CONFIG = {
  application: {
    // "coming-soon" | "open" | "few-left" | "closed"
    status: "coming-soon",
    url: ""
  }
};

const STATUS = {
  "coming-soon": { label: "申込情報は後日公開", cta: "申込情報を確認する", enabled: false },
  "open": { label: "申込受付中", cta: "学校説明会に申し込む", enabled: true },
  "few-left": { label: "受付中｜残席わずか", cta: "学校説明会に申し込む", enabled: true },
  "closed": { label: "受付終了", cta: "申込受付は終了しました", enabled: false }
};

function applyApplicationState() {
  const state = STATUS[SITE_CONFIG.application.status] || STATUS["coming-soon"];
  document.querySelectorAll("[data-status-label]").forEach(el => { el.textContent = state.label; });
  document.querySelectorAll("[data-cta-label]").forEach(el => { el.textContent = state.cta; });
  document.querySelectorAll("[data-primary-cta]").forEach(link => {
    if (state.enabled && SITE_CONFIG.application.url) {
      link.href = SITE_CONFIG.application.url;
      link.classList.remove("is-disabled");
      link.removeAttribute("aria-disabled");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.classList.add("is-disabled");
      link.setAttribute("aria-disabled", "true");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.href = "#application";
    }
  });
}

applyApplicationState();
