import { supabase } from './supabase.js';
console.log("Login JS loaded successfully!");
const loginForm = document.getElementById('login-form');
const errorMessageDiv = document.getElementById('error-message');
const langBtn = document.getElementById('lang-btn');

// قاموس الترجمات الخاص بصفحة تسجيل الدخول
const loginTranslations = {
    ar: {
        login_title: "تسجيل الدخول - Keymerv Warehouse",
        brand_name: "Keymerv Warehouse",
        login_heading: "تسجيل دخول الفروع والمستودع",
        system_description: "النظام الإداري الذكي لإدارة المخزون، تنظيم سلاسل التوريد، ومتابعة حركة التغذية للفروع بدقة وسرعة فائقة.",
        login_subheading: "أدخل بيانات الاعتماد الخاصة بحسابك والمعتمدة من الإدارة العامة",
        email_label: "البريد الإلكتروني",
        password_label: "كلمة المرور",
        login_btn_action: "دخول لوحة التحكم",
        footer_text: "جميع الحقوق محفوظة © 2026 - Keymerv Warehouse (أحد مشاريع منصة Keymerv Platform)",
        err_empty: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
        err_invalid: "خطأ: البريد الإلكتروني أو كلمة المرور غير مطابقة",
        verifying: "جاري التحقق..."
    },
    en: {
        login_title: "Login - Keymerv Warehouse",
        brand_name: "Keymerv Warehouse",
        login_heading: "Branch & Warehouse Login",
        system_description: "The smart administrative system for inventory management, supply chain coordination, and branch replenishment tracking.",
        login_subheading: "Enter your account credentials provided by general administration",
        email_label: "Email Address",
        password_label: "Password",
        login_btn_action: "Access Dashboard",
        footer_text: "All Rights Reserved © 2026 - Keymerv Warehouse (A Keymerv Platform Project)",
        err_empty: "Please enter email and password",
        err_invalid: "Error: Email or password does not match",
        verifying: "Verifying..."
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function applyLoginLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    const htmlRoot = document.getElementById('html-root');
    if (htmlRoot) {
        htmlRoot.setAttribute('lang', lang);
        htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }

    if (langBtn) {
        langBtn.innerText = lang === 'ar' ? 'English' : 'العربية';
    }

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (loginTranslations[lang] && loginTranslations[lang][key]) {
            element.innerText = loginTranslations[lang][key];
        }
    });
}

window.toggleLanguage = function() {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLoginLanguage(newLang);
};

// تطبيق اللغة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    applyLoginLanguage(currentLang);
});

// منطق تسجيل الدخول
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        if (errorMessageDiv) {
            errorMessageDiv.classList.add('hidden');
            errorMessageDiv.innerText = '';
        }

        if (!email || !password) {
            if (errorMessageDiv) {
                errorMessageDiv.innerText = loginTranslations[currentLang].err_empty;
                errorMessageDiv.classList.remove('hidden');
            }
            return;
        }

        const originalText = submitBtn.innerText;
        submitBtn.innerText = loginTranslations[currentLang].verifying;
        submitBtn.disabled = true;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            window.location.href = 'dashboard.html';

        } catch (error) {
            let message = loginTranslations[currentLang].err_invalid;
            if (error.message && !error.message.includes('Invalid login credentials')) {
                message = error.message;
            }

            if (errorMessageDiv) {
                errorMessageDiv.innerText = message;
                errorMessageDiv.classList.remove('hidden');
            }

            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}
