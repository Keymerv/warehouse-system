import { supabase } from './supabase.js';

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
        .maybeSingle();

    // 3. فحص هل المستخدم أدمن (من بيانات profiles أو من metadata الجلسة)
    const userMetaRole = session.user.user_metadata?.role;
    const isAdmin = 
        profile?.role === 'admin' || 
        profile?.role === 'مدير' || 
        userMetaRole === 'admin' || 
        userMetaRole === 'مدير';

    // 4. طرد الحسابات المحذوفة فقط (إذا لم يكن أدمن ولا يوجد له صف في profiles)
    if (!profile && !isAdmin) {
        console.warn('الحساب غير موجود في profiles وتم تسجيل الخروج.');
        await supabase.auth.signOut();
        window.location.href = 'login.html';
        return;
    }

    // 5. معرفة اسم الصفحة الحالية
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '') || 'index';

    const allowedPages = profile?.allowed_pages || [];

    // 6. حماية الصفحة الحالية للموظفين العاديين
    if (!isAdmin && pageName !== 'dashboard' && pageName !== 'index' && pageName !== 'login' && pageName !== '') {
        let isAllowed = allowedPages.includes(pageName);

        // معالجة خاصة لصفحة الطلبات
        if ((pageName === 'orders' || pageName === 'feeding') && 
            (allowedPages.includes('feeding') || allowedPages.includes('orders'))) {
            isAllowed = true;
        }

        if (!isAllowed) {
            alert('تنبيه: لا تملك صلاحية لدخول هذه الصفحة!');
            window.location.href = 'dashboard.html';
            return;
        }
    }

    // 7. تحديث القائمة الجانبية
    updateSidebarUI(isAdmin, allowedPages);
}

// دالة تحديث شكل القائمة الجانبية
function updateSidebarUI(isAdmin, allowedPages) {
    if (isAdmin) return; // الأدمن يرى كل القوائم بدون شارات أو حظر

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

// تنفيذ الفحص فوراً
protectRoute();
