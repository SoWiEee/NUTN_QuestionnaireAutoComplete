(function () {
    // ✅ 問卷首頁
    if (document.querySelector('table') && location.href.includes("CourseList")) {
        const rows = Array.from(document.querySelectorAll('table tr')).slice(1); // 跳過標題列
        const postbacks = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const fillStatus = cells[5]?.textContent.trim(); // 第六欄為「授課教師填寫狀態」
            if (fillStatus === '未填') {
                const fillLink = row.querySelector('a[href*="__doPostBack"]');
                if (fillLink) {
                    const match = fillLink.href.match(/__doPostBack\('([^']+)','([^']*)'\)/);
                    if (match) {
                        postbacks.push({
                            eventTarget: match[1],
                            eventArgument: match[2]
                        });
                    }
                }
            }
        });

        if (postbacks.length === 0) {
            alert("✅ 所有問卷都已填寫完畢！");
            return;
        }

        localStorage.setItem('pendingPostbacks', JSON.stringify(postbacks));
        const first = postbacks.shift();
        localStorage.setItem('pendingPostbacks', JSON.stringify(postbacks));
        __doPostBack(first.eventTarget, first.eventArgument);
        return;
    }

    // ✅ 問卷填寫頁
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        const label = document.querySelector(`label[for="${radio.id}"]`);
        if (label && label.textContent.trim() === "同意") {
            radio.checked = true;
        }
    });

    // ✅ 簡答題填入「無」
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.value = '無';

    // ✅ 提交表單
    setTimeout(() => {
        const submitBtn = document.querySelector('input[type=submit][value*="送出"]');
        if (submitBtn) {
            submitBtn.click();
        }
    }, 1000);

    // ✅ 送出後跳下一份
    setTimeout(() => {
        const postbacks = JSON.parse(localStorage.getItem('pendingPostbacks') || '[]');
        if (postbacks.length > 0) {
            const next = postbacks.shift();
            localStorage.setItem('pendingPostbacks', JSON.stringify(postbacks));
            __doPostBack(next.eventTarget, next.eventArgument);
        } else {
            alert("🎉 所有問卷已自動填寫完成！");
        }
    }, 3000);
})();
