// 在問卷頁面自動執行填寫邏輯
if (document.querySelector('textarea') && location.href.includes('Questionnaire')) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('fill.js');
    document.body.appendChild(script);
}
