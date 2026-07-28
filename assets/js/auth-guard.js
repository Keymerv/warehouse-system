import { supabase } from './supabase.js';

// دالة فحص الجلسة والصلاحيات المركزية
async function protectRoute() {
    // 1. فحص وجود جلسة تسجيل دخول نشطة
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        window.location.href = 'login.html';
        return;
    }

    // 2. جلب بيانات دور المستخدم والصلاحيات المسموحة من جدول profiles
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, allowed_pages')
        .eq('id', session.user.id)
        .single();

    // 🔴 سد الثغرة: إذا كان الحساب مفقوداً أو تم حذفه، يتم تسجيل الخروج فوراً وطرده
    if (profileError || !profile) {
        console.warn('الحساب غير موجود أو تم حذفه من النظام.');
        await supabase.auth.signOut();
        window.location.href = 'login.html';
        return;
    }

    // 3. معرفة اسم الصفحة الحالية تلقائياً من الرابط
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '') || 'index';

    const isAdmin = profile.role === 'admin' || profile.role === 'مدير';
    const allowedPages = profile.allowed_pages || [];

    // 4. حماية الصفحة الحالية (إذا لم يكن أدمن ولم تكن صفحة عامة)
    if (!isAdmin && pageName !== 'dashboard' && pageName !== 'index' && pageName !== 'login' && pageName !== '') {
        let isAllowed = allowedPages.includes(pageName);

        // معالجة خاصة لصفحة الطلبات
        if ((pageName === 'orders' || pageName === 'feeding') && 
            (allowedPages.includes('feeding') || allowedPages.includes('orders'))) {
            isAllowed = true;
        }

        // إذا لم تكن الصفحة مسموحة، يظهر التنبيه ويتم توجيهه للرئيسية
        if (!isAllowed) {
            alert('تنبيه: لا تملك صلاحية لدخول هذه الصفحة!');
            window.location.href = 'dashboard.html';
            return;
        }
    }

    // 5. تطبيق شارات الصلاحيات على القائمة الجانبية (Sidebar)
    updateSidebarUI(isAdmin, allowedPages);
}

// دالة تحديث شكل القائمة الجانبية وحظر الروابط غير المسموحة
function updateSidebarUI(isAdmin, allowedPages) {
    if (isAdmin) return;

    const sidebarLinks = document.querySelectorAll('aside a, .sidebar a, nav a, a[data-page]');

    sidebarLinks.forEach(link => {
        let pageKey = link.getAttribute('data-page');

        if (!pageKey) {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                pageKey = href.split('/').pop().replace('.html', '');
            }
        }

        if (!pageKey || pageKey === 'dashboard' || pageKey === 'index' || pageKey === 'login') {
            return;
        }

        let isAllowed = allowedPages.includes(pageKey);

        if ((pageKey === 'orders' || pageKey === 'feeding') && 
            (allowedPages.includes('feeding') || allowedPages.includes('orders'))) {
            isAllowed = true;
        }

        if (!isAllowed) {
            if (link.querySelector('.no-perm-badge')) return;

            const badge = document.createElement('span');
            badge.className = 'no-perm-badge';
            badge.innerText = 'لا تمتلك صلاحية';
            badge.style.cssText = `
                font-size: 10px;
                background-color: #ef4444;
                color: #ffffff;
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 8px;
                display: inline-block;
                white-space: nowrap;
                font-weight: normal;
            `;

            link.style.display = 'flex';
            link.style.alignItems = 'center';
            link.style.justifyContent = 'space-between';
            link.style.opacity = '0.5';
            link.style.cursor = 'not-allowed';

            link.appendChild(badge);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, true);
        }
    });
}

// تنفيذ الفحص والحماية
protectRoute();
