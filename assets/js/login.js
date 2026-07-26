import { supabase } from './supabase.js';

const loginForm = document.getElementById('login-form');
const errorMessageDiv = document.getElementById('error-message');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // إخفاء أي خطأ سابق
        if (errorMessageDiv) {
            errorMessageDiv.classList.add('hidden');
            errorMessageDiv.innerText = '';
        }

        if (!email || !password) {
            if (errorMessageDiv) {
                errorMessageDiv.innerText = 'الرجاء إدخال البريد الإلكتروني وكلمة المرور';
                errorMessageDiv.classList.remove('hidden');
            }
            return;
        }

        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'جاري التحقق...';
        submitBtn.disabled = true;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                throw error; 
            }

            // التوجيه الناجح
            window.location.href = 'dashboard.html';

        } catch (error) {
            let message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            if (error.message && error.message.includes('Invalid login credentials')) {
                message = 'خطأ: البريد الإلكتروني أو كلمة المرور غير مطابقة';
            } else if (error.message) {
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
