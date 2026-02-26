document.addEventListener('DOMContentLoaded', function() {
    const productCategory = document.getElementById('product-category');
    const contentionFields = document.getElementById('contention-fields');
    const attellesFields = document.getElementById('attelles-fields');
    const gibaudFields = document.getElementById('chaussures-gibaud-fields');
    const podowellMessage = document.getElementById('podowell-message');
    const priceForm = document.getElementById('price-calculator');
    const resultSection = document.getElementById('result-section');
    const priceResult = document.getElementById('price-result');
    const copyPriceBtn = document.getElementById('copy-price-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const calculateBtn = document.getElementById('calculate-btn');

    // Tarifs LPP — Série (arrêté 26/06/2025, applicable 15/07/2025)
    const lppPricesSerie = { 'chaussette': 21.96, 'bas_cuisse': 29.18, 'collant': 41.19 };
    // Tarifs LPP — Sur mesure (inchangés)
    const lppPricesSurMesure = { 'chaussette': 22.40, 'bas_cuisse': 29.78, 'collant': 42.03 };

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    productCategory.addEventListener('change', handleCategoryChange);

    document.querySelectorAll('input[name="premium-range"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            document.getElementById('fabrication-type-group').style.display = this.value === 'yes' ? '' : 'none';
        });
    });

    priceForm.addEventListener('submit', function(e) { calculatePrice(e); });
    calculateBtn.addEventListener('click', function(e) { calculatePrice(e); });
    copyPriceBtn.addEventListener('click', copyPrice);
    themeToggleBtn.addEventListener('click', toggleTheme);

    function handleCategoryChange() {
        contentionFields.classList.add('d-none');
        attellesFields.classList.add('d-none');
        gibaudFields.classList.add('d-none');
        podowellMessage.classList.add('d-none');
        var fg = document.getElementById('fabrication-type-group');
        if (fg) fg.style.display = 'none';
        switch(productCategory.value) {
            case 'contention': contentionFields.classList.remove('d-none'); break;
            case 'attelles': attellesFields.classList.remove('d-none'); break;
            case 'chaussures-gibaud': gibaudFields.classList.remove('d-none'); break;
            case 'chaussures-podowell': podowellMessage.classList.remove('d-none'); break;
        }
    }

    function calculatePrice(event) {
        event.preventDefault();
        if (!productCategory.value) { priceForm.classList.add('was-validated'); return; }
        let fp = 0;
        switch(productCategory.value) {
            case 'contention': fp = calculateContentionPrice(); break;
            case 'attelles': fp = calculateAttellesPrice(); break;
            case 'chaussures-gibaud': fp = calculateGibaudPrice(); break;
            case 'chaussures-podowell': resultSection.classList.add('d-none'); return;
            default: return;
        }
        priceResult.textContent = fp + ' €';
        resultSection.classList.remove('d-none');
    }

    function calculateContentionPrice() {
        const t = document.getElementById('contention-type').value;
        const bp = parseFloat(document.getElementById('contention-buy-price').value) || 0;
        const isPremium = document.querySelector('input[name="premium-range"]:checked').value === 'yes';
        if (isPremium) {
            const fab = document.querySelector('input[name="fabrication-type"]:checked').value;
            const lpp = (fab === 'surmesure') ? lppPricesSurMesure : lppPricesSerie;
            return lpp[t].toFixed(2).replace('.', ',');
        }
        return Math.ceil(bp + 15).toFixed(2).replace('.', ',');
    }

    function calculateAttellesPrice() {
        const bp = parseFloat(document.getElementById('attelles-buy-price').value) || 0;
        const lp = parseFloat(document.getElementById('attelles-lpp').value) || 0;
        return Math.ceil(Math.max(bp * 1.7, lp + 5)).toFixed(2).replace('.', ',');
    }

    function calculateGibaudPrice() {
        const bp = parseFloat(document.getElementById('gibaud-buy-price').value) || 0;
        const lp = parseFloat(document.getElementById('gibaud-lpp').value) || 0;
        return Math.ceil(Math.max(bp * 1.6, lp + 10)).toFixed(2).replace('.', ',');
    }

    function copyPrice() {
        navigator.clipboard.writeText(priceResult.textContent).then(() => {
            const o = copyPriceBtn.innerHTML;
            copyPriceBtn.innerHTML = '<i class="fas fa-check me-2"></i>Prix copié!';
            setTimeout(() => { copyPriceBtn.innerHTML = o; }, 2000);
        });
    }

    function toggleTheme() {
        const n = (document.documentElement.getAttribute('data-theme') || 'light') === 'light' ? 'dark' : 'light';
        setTheme(n); localStorage.setItem('theme', n);
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggleBtn.innerHTML = theme === 'dark'
            ? '<i class="fas fa-sun"></i><span class="ms-1 d-none d-sm-inline">Mode clair</span>'
            : '<i class="fas fa-moon"></i><span class="ms-1 d-none d-sm-inline">Mode sombre</span>';
    }
});