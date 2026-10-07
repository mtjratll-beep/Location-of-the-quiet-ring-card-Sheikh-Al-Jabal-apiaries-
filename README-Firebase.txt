إعداد Firebase — مناحل شيخ الجبل
================================

تم توحيد إعداد Firebase في الملف:
firebase-config.js

المشروع:
sheikh-apiaries-stamp-card

الصفحات:
- index.html — تسجيل العملاء وبطاقة الأختام
- admin.html — لوحة المدير
- assets/logo.svg — الشعار

مهم قبل النشر:
1) في Firebase Console > Authentication > Sign-in method:
   فعّل Email/Password و Google.
2) في Authentication > Settings > Authorized domains:
   أضف نطاق موقعك (GitHub Pages أو الاستضافة التي ستستخدمها).
3) أنشئ حساب المدير في Authentication.
4) إذا كان UID لحساب المدير مختلفًا عن UID الموجود في admin.html و firestore.rules:
   غيّر ADMIN_UID في الملفين إلى UID الصحيح.
5) فعّل Firestore Database.

النشر باستخدام Firebase CLI:
firebase login
firebase use sheikh-apiaries-stamp-card
firebase deploy

ملاحظة:
مفتاح Firebase Web API ليس سرًا بحد ذاته، والحماية الفعلية للبيانات تتم عبر Firestore Security Rules.


## التعديلات الجديدة
- بعد تسجيل الدخول للحساب الجديد تظهر نافذة إجبارية للاسم الثلاثي ورقم الجوال.
- تم تبسيط بطاقة العميل وتصغيرها وإزالة الشعار العلوي وعبارة العضوية والنص التعريفي.
- تسجيل الخروج أصبح زرًا دائريًا عائمًا في الزاوية.
- صفحة المدير تشمل البحث بالاسم/الجوال، و10 دوائر أختام كبيرة لكل عميل، وإضافة/تصفير الأختام.
- إعدادات المدير تسمح برفع الشعار والختم وتغيير نصوص البطاقة وعدد الأختام وألوان البطاقة.
- تم إضافة storage.rules. عند النشر استخدم Firebase Hosting + Firestore + Storage.
