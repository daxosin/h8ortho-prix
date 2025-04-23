document.addEventListener('DOMContentLoaded', function() {
    console.log("Script chargé");
    
    // Référence aux éléments DOM
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
    
    // Données LPP pour les articles spéciaux
    const lppPrices = {
        'chaussette': 22.40,
        'bas_cuisse': 29.78,
        'collant': 42.03
    };
    
    // Vérifier si un thème est stocké et l'appliquer
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Gestionnaire de l'événement de changement de catégorie
    productCategory.addEventListener('change', handleCategoryChange);
    
    // Gestionnaire de l'événement de soumission du formulaire
    priceForm.addEventListener('submit', function(event) {
        console.log("Formulaire soumis");
        calculatePrice(event);
    });
    
    // Gestionnaire pour le bouton de calcul (en plus de la soumission du formulaire)
    calculateBtn.addEventListener('click', function(event) {
        console.log("Bouton Calculer cliqué");
        calculatePrice(event);
    });
    
    // Gestionnaire pour le bouton de copie du prix
    copyPriceBtn.addEventListener('click', copyPrice);
    
    // Gestionnaire pour le bouton de changement de thème
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Fonction pour gérer le changement de catégorie de produit
    function handleCategoryChange() {
        // Masquer tous les champs dynamiques
        contentionFields.classList.add('d-none');
        attellesFields.classList.add('d-none');
        gibaudFields.classList.add('d-none');
        podowellMessage.classList.add('d-none');
        
        // Afficher le champ approprié selon la catégorie sélectionnée
        switch(productCategory.value) {
            case 'contention':
                contentionFields.classList.remove('d-none');
                break;
            case 'attelles':
                attellesFields.classList.remove('d-none');
                break;
            case 'chaussures-gibaud':
                gibaudFields.classList.remove('d-none');
                break;
            case 'chaussures-podowell':
                podowellMessage.classList.remove('d-none');
                break;
        }
    }
    
    // Fonction pour calculer le prix en fonction de la catégorie
    function calculatePrice(event) {
        console.log("Fonction calculatePrice appelée");
        event.preventDefault();
        
        // Si aucune catégorie n'est sélectionnée
        if (productCategory.value === "" || productCategory.value === null) {
            console.log("Aucune catégorie sélectionnée");
            priceForm.classList.add('was-validated');
            return;
        }
        
        console.log("Catégorie sélectionnée:", productCategory.value);
        
        let finalPrice = 0;
        
        switch(productCategory.value) {
            case 'contention':
                console.log("Calcul pour contention");
                finalPrice = calculateContentionPrice();
                break;
            case 'attelles':
                console.log("Calcul pour attelles");
                finalPrice = calculateAttellesPrice();
                break;
            case 'chaussures-gibaud':
                console.log("Calcul pour chaussures Gibaud");
                finalPrice = calculateGibaudPrice();
                break;
            case 'chaussures-podowell':
                console.log("Redirection pour Podowell");
                // Prix aligné sur le site Podowell, pas de calcul
                resultSection.classList.add('d-none');
                return;
            default:
                console.log("Catégorie non reconnue:", productCategory.value);
                return;
        }
        
        console.log("Prix final calculé:", finalPrice);
        
        // Afficher le résultat
        priceResult.textContent = finalPrice + ' €';
        resultSection.classList.remove('d-none');
    }
    
    // Calcul spécifique pour les articles de contention
    function calculateContentionPrice() {
        const contentionType = document.getElementById('contention-type').value;
        const buyPrice = parseFloat(document.getElementById('contention-buy-price').value) || 0;
        const isPremiumRange = document.querySelector('input[name="premium-range"]:checked').value === 'yes';
        
        let price;
        
        if (isPremiumRange) {
            // Utilisation des tarifs LPP pour les gammes spéciales (pas d'arrondi)
            price = lppPrices[contentionType];
            console.log("Type d'article:", contentionType);
            console.log("Prix LPP utilisé:", price);
            // Pas d'arrondi pour les tarifs LPP spéciaux
            return price.toFixed(2).replace('.', ',');
        } else {
            // Prix d'achat + 15€ arrondi à l'euro supérieur
            price = Math.ceil(buyPrice + 15);
            console.log("Prix d'achat HT:", buyPrice);
            console.log("Prix calculé (achat + 15):", price);
            // Arrondi à l'euro supérieur
            return price.toFixed(2).replace('.', ',');
        }
    }
    
    // Calcul pour les attelles
    function calculateAttellesPrice() {
        const buyPrice = parseFloat(document.getElementById('attelles-buy-price').value) || 0;
        const lppPrice = parseFloat(document.getElementById('attelles-lpp').value) || 0;
        
        // Prix = max(Prix HT × 1,7 ; LPP + 5 €) arrondi à l'euro supérieur
        const priceBuyCalc = buyPrice * 1.7;
        const priceLppCalc = lppPrice + 5;
        const price = Math.max(priceBuyCalc, priceLppCalc);
        
        console.log("Prix achat HT attelle:", buyPrice);
        console.log("Prix calculé (HT × 1,7):", priceBuyCalc);
        console.log("Tarif LPP attelle:", lppPrice);
        console.log("Prix calculé (LPP + 5):", priceLppCalc);
        console.log("Prix final (max des deux):", price);
        
        return Math.ceil(price).toFixed(2).replace('.', ',');
    }
    
    // Calcul pour les chaussures Gibaud
    function calculateGibaudPrice() {
        const buyPrice = parseFloat(document.getElementById('gibaud-buy-price').value) || 0;
        const lppPrice = parseFloat(document.getElementById('gibaud-lpp').value) || 0;
        
        // Prix = max(Prix HT × 1,6 ; LPP + 10 €) arrondi à l'euro supérieur
        const priceBuyCalc = buyPrice * 1.6;
        const priceLppCalc = lppPrice + 10;
        const price = Math.max(priceBuyCalc, priceLppCalc);
        
        console.log("Prix achat HT Gibaud:", buyPrice);
        console.log("Prix calculé (HT × 1,6):", priceBuyCalc);
        console.log("Tarif LPP Gibaud:", lppPrice);
        console.log("Prix calculé (LPP + 10):", priceLppCalc);
        console.log("Prix final (max des deux):", price);
        
        return Math.ceil(price).toFixed(2).replace('.', ',');
    }
    
    // Fonction pour copier le prix dans le presse-papier
    function copyPrice() {
        const priceToCopy = priceResult.textContent;
        navigator.clipboard.writeText(priceToCopy)
            .then(() => {
                // Changer temporairement le texte du bouton pour indiquer que le prix a été copié
                const originalText = copyPriceBtn.innerHTML;
                copyPriceBtn.innerHTML = '<i class="fas fa-check me-2"></i>Prix copié!';
                
                setTimeout(() => {
                    copyPriceBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Erreur lors de la copie :', err);
            });
    }
    
    // Fonction pour basculer entre les thèmes clair et sombre
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    // Fonction pour définir le thème
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Mettre à jour l'icône et le texte du bouton
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i><span class="ms-1 d-none d-sm-inline">Mode clair</span>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i><span class="ms-1 d-none d-sm-inline">Mode sombre</span>';
        }
    }
});