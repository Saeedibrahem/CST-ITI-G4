# دليل استخدام النافبار الديناميكي

## نظرة عامة

تم إنشاء نظام نافبار ديناميكي يمكن استخدامه في جميع صفحات الموقع بدون تكرار الكود. النظام يتعرف تلقائياً على دور المستخدم والصفحة الحالية ويعرض النافبار المناسب.

## الملفات المطلوبة

### 1. ملف `shared.js`
يحتوي على جميع الدوال المطلوبة لإدارة النافبار:
- `getUserRole()` - يحصل على دور المستخدم من localStorage
- `getCurrentPage()` - يحدد الصفحة الحالية
- `generateNavbar()` - ينشئ النافبار للصفحات الفرعية
- `generateHomeNavbar()` - ينشئ النافبار للصفحة الرئيسية
- `renderNavbar()` - الدالة الرئيسية لرسم النافبار
- `logout()` - دالة تسجيل الخروج

### 2. إضافة الملف في HTML
```html
<script src="../../src/js/shared.js"></script>
```

## كيفية الاستخدام

### في الصفحة الرئيسية (index.html)
```html
<!-- في head -->
<script defer src="./src/js/shared.js"></script>

<!-- في نهاية body -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
    window.sharedUtils.renderNavbar();
  }
});
</script>
```

### في الصفحات الفرعية
```html
<!-- في head -->
<script src="../../src/js/shared.js"></script>

<!-- في نهاية body -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  if (window.sharedUtils && window.sharedUtils.renderNavbar) {
    window.sharedUtils.renderNavbar();
  }
});
</script>
```

## الأدوار المدعومة

### 1. Guest (زائر)
- روابط: Home, Catalog, About Us
- الجانب الأيمن: أزرار Login و Signup

### 2. Customer (عميل)
- روابط: Home, Catalog, About Us, My Orders
- الجانب الأيمن: قائمة المستخدم مع Profile و Orders

### 3. Seller (بائع)
- روابط: Home, Catalog, About Us, Seller Dashboard
- الجانب الأيمن: قائمة البائع مع Dashboard و Products و Orders

### 4. Admin (مدير)
- روابط: Home, Catalog, About Us, Admin Dashboard
- الجانب الأيمن: قائمة المدير مع إدارة المستخدمين والمنتجات

## إدارة حالة المستخدم

### تسجيل الدخول
```javascript
// عند تسجيل الدخول الناجح
localStorage.setItem('user', JSON.stringify({
  id: 'user_id',
  name: 'User Name',
  role: 'customer' // أو 'seller' أو 'admin'
}));
```

### تسجيل الخروج
```javascript
// يتم استدعاؤها تلقائياً من النافبار
logout();
```

### تغيير الدور
```javascript
// تحديث دور المستخدم
const user = JSON.parse(localStorage.getItem('user'));
user.role = 'seller';
localStorage.setItem('user', JSON.stringify(user));

// إعادة رسم النافبار
window.sharedUtils.renderNavbar();
```

## الصفحات المدعومة

النظام يتعرف تلقائياً على الصفحات التالية:
- `home` - الصفحة الرئيسية
- `catalog` - صفحة المنتجات
- `about` - صفحة من نحن
- `admin` - لوحة تحكم المدير
- `seller` - لوحة تحكم البائع
- `profile` - صفحة الملف الشخصي
- `cart` - صفحة السلة
- `service` - صفحة خدمة العملاء

## تخصيص النافبار

### إضافة روابط جديدة
```javascript
// في ملف shared.js، أضف الرابط في getMainLinks()
case "admin":
  return `
    <li class="nav-item">
      <a class="nav-link fw-semibold text-dark ${isActive('home')}" href="../../index.html">Home</a>
    </li>
    <!-- أضف الرابط الجديد هنا -->
    <li class="nav-item">
      <a class="nav-link fw-semibold text-dark" href="../../pages/new-page.html">New Page</a>
    </li>
  `;
```

### تخصيص الأيقونات والألوان
```javascript
// تغيير لون الرابط النشط
const isActive = (page) => currentPage === page ? 'active text-primary' : '';

// تغيير أيقونة القائمة
<i class="fa-solid fa-custom-icon fa-lg"></i>
```

## استكشاف الأخطاء

### النافبار لا يظهر
1. تأكد من إضافة ملف `shared.js`
2. تأكد من استدعاء `renderNavbar()`
3. تحقق من وحدة تحكم المتصفح للأخطاء

### الروابط لا تعمل
1. تأكد من صحة مسارات الملفات
2. تحقق من أن الملفات موجودة في المسارات الصحيحة

### دور المستخدم لا يتغير
1. تأكد من تحديث localStorage
2. استدع `renderNavbar()` مرة أخرى

## أمثلة عملية

### صفحة منتج جديد
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Product</title>
  <link rel="stylesheet" href="../../assets/lib/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">
</head>
<body>
  <!-- النافبار سيتم إدراجه هنا -->
  
  <div class="container mt-5">
    <h1>صفحة المنتج الجديد</h1>
    <!-- محتوى الصفحة -->
  </div>

  <script src="../../assets/lib/js/bootstrap.bundle.min.js"></script>
  <script src="../../src/js/shared.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      if (window.sharedUtils && window.sharedUtils.renderNavbar) {
        window.sharedUtils.renderNavbar();
      }
    });
  </script>
</body>
</html>
```

## ملاحظات مهمة

1. **ترتيب الملفات**: تأكد من إضافة `shared.js` قبل أي ملفات JavaScript أخرى
2. **Bootstrap**: تأكد من إضافة Bootstrap CSS و JavaScript
3. **Font Awesome**: مطلوب للأيقونات
4. **المسارات**: تأكد من صحة المسارات النسبية حسب موقع الصفحة

## الدعم

لأي استفسارات أو مشاكل، راجع:
- ملف `shared.js` للتفاصيل التقنية
- صفحة `test-navbar.html` للاختبار
- هذا الدليل للاستخدام
