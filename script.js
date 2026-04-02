(function () {
    "use strict";

    const SCORE_LEVELS = {
        LOW: 50,
        FULL: 100
    };

    const elements = {
        role: document.getElementById('role'),
        taskType: document.getElementById('taskType'),
        context: document.getElementById('context'),
        constraints: document.getElementById('constraints'),
        format: document.getElementById('format'),
        result: document.getElementById('resultPrompt'),
        aiAnswer: document.getElementById('aiAnswer'),
        badge: document.getElementById('scoreBadge'),
        list: document.getElementById('improvementsList'),
        checkboxes: document.querySelectorAll('.form-check-input'),
        btnGenerate: document.getElementById('btnGenerate')
    };

    elements.btnGenerate.addEventListener('click', generatePrompt);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('btnClear').addEventListener('click', resetAll);
    document.getElementById('btnImprove').addEventListener('click', suggestImprovements);
    elements.context.addEventListener('input', validateForm);
    elements.checkboxes.forEach(cb => cb.addEventListener('change', updateScore));

    validateForm();
    updateScore();


    function validateForm() {
        const contextVal = elements.context.value.trim();

        if (!contextVal) {
            elements.btnGenerate.disabled = true;
            elements.context.classList.add('is-invalid');
        } else {
            elements.btnGenerate.disabled = false;
            elements.context.classList.remove('is-invalid');
        }
    }

    function generatePrompt() {
        const contextVal = elements.context.value.trim();

        if (!contextVal) {
            elements.context.classList.add('is-invalid');
            elements.context.focus();
            return;
        }

        elements.context.classList.remove('is-invalid');

        const promptText = `ROLE: ${elements.role.value}
TASK: ${elements.taskType.value}

CONTEXT:
${contextVal}

CONSTRAINTS:
${elements.constraints.value.trim() || "Standard professional quality."}

OUTPUT FORMAT:
${elements.format.value}`;

        elements.result.value = promptText;
    }

    async function copyToClipboard() {
        if (!elements.result.value) return;

        try {
            await navigator.clipboard.writeText(elements.result.value);

            const btn = document.getElementById('copyBtn');
            const oldText = btn.innerText;

            btn.innerText = "DONE!";
            setTimeout(() => btn.innerText = oldText, 1500);

        } catch (err) {
            console.error("Copy failed", err);
        }
    }

    function updateScore() {
        const checked = document.querySelectorAll('.form-check-input:checked').length;
        const total = elements.checkboxes.length;
        const percent = (checked / total) * 100;

        elements.badge.innerText = `${checked}/${total} пройдено`;

        elements.badge.className =
            "badge rounded-pill fs-6 " +
            (percent < SCORE_LEVELS.LOW
                ? "bg-danger"
                : percent < SCORE_LEVELS.FULL
                    ? "bg-warning"
                    : "bg-success");
    }

    function suggestImprovements() {
        elements.list.innerHTML = "";

        const unchecked = Array.from(elements.checkboxes).filter(c => !c.checked);

        if (unchecked.length === 0) {
            elements.list.innerHTML =
                "<div class='perfect-score'>АНАЛІЗ ЗАВЕРШЕНО: БЕЗДОГАННО.</div>";
            return;
        }

        const priorityOrder = [
            'check1',
            'check4',
            'check5',
            'check6',
            'check2',
            'check3',
            'check7',
            'check8'
        ];

        const sorted = unchecked.sort((a, b) => {
            return priorityOrder.indexOf(a.id) - priorityOrder.indexOf(b.id);
        });

        const toShow = sorted.slice(0, 4);

        toShow.forEach(check => {
            const div = document.createElement('div');
            div.className = "advice-item";
            div.innerText = check.dataset.advice;
            elements.list.appendChild(div);
        });
    }

    function resetAll() {
        if (
            (elements.aiAnswer.value ||
                elements.result.value ||
                elements.context.value) &&
            !confirm("Очистити робочу область?")
        ) {
            return;
        }

        document.querySelectorAll('textarea').forEach(t => (t.value = ""));
        elements.checkboxes.forEach(c => (c.checked = false));
        elements.list.innerHTML = "";

        updateScore();
        validateForm();
    }

})();