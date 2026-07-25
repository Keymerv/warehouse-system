const translations = {
    ar: {
        page_title: "نظام إدارة المستودعات وفروع المطاعم",
        brand_name: "نظام المستودعات",
        login_btn: "تسجيل الدخول",
        hero_title: "الربط الذكي بين المستودع الرئيسي وفروع مطاعمك",
        hero_desc: "أدر مخزونك، تتبع طلبات التوريد لكل فرع بدقة، وتحكم بالكميات الحية بلحظة واحدة وبدون أي تعقيد.",
        start_now: "ابدأ الآن",
        footer_text: "جميع الحقوق محفوظة © نظام المستودعات والفروع 2026"
    },
    en: {
        page_title: "Warehouse & Restaurant Branches Management System",
        brand_name: "Warehouse System",
        login_btn: "Login",
        hero_title: "Smart Integration Between Main Warehouse & Restaurant Branches",
        hero_desc: "Manage your inventory, track branch supply orders precisely, and control live quantities effortlessly.",
        start_now: "Get Started",
        footer_text: "All Rights Reserved © Warehouse & Branches System 2026"
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    const htmlRoot = document.getElementById('html-root');
    htmlRoot.setAttribute('lang', lang);
    htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // تغيير نص زر اللغة
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
        langBtn.innerText = lang === 'ar' ? 'English' : 'العربية';
    }

    // تحديث النصوص بناءً على مفاتيح البيانات
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
}

function toggleLanguage() {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLanguage(newLang);
}

// تطبيق اللغة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
});
