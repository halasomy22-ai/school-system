import React, { useState, useEffect } from 'react';

export default function UsersPermissionsSection({ handlePermissionChange = () => {}, playHover = () => {} }) {
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: '', loginName: '', pin: '', role: 'معلم',
    permissions: { students: false, classes: false, teachers: false, finance: false, results: false }
  });

  // ✅ فرض الرابط البرمجي الرسمي المباشر والآمن لـ API جيت هوب لكسر حظر الـ CORS نهائياً
  const CLOUD_API_URL = "https://github.com";
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

  const fetchCloudUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(CLOUD_API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${GITHUB_TOKEN}`,
          "Accept": "application/vnd.github.v3+json",
          "Cache-Control": "no-cache"
        }
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      const decodedText = decodeURIComponent(escape(atob(data.content)));
      const parsedData = JSON.parse(decodedText);
      setSystemUsers(parsedData.system_users || []);
    } catch (err) {
      // حسابات افتراضية في حال وجود أي عطل في السيرفر
      setSystemUsers([
        { id: '1', name: "عثمان صديق", loginName: "admin", role: "أدمن", pin: "123", permissions: { students: true, classes: true, teachers: true, finance: true, results: true } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCloudUsers(); }, []);

  const handleCheckboxChange = (key) => {
    setNewUser(p => ({ ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } }));
  };

  const saveNewUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.loginName || !newUser.pin) return alert("الرجاء ملء حقول البيانات!");
    try {
      const getRes = await fetch(CLOUD_API_URL, { headers: { "Authorization": `Bearer ${GITHUB_TOKEN}` } });
      const data = await getRes.json();
      const parsed = JSON.parse(decodeURIComponent(escape(atob(data.content))));
      
      const created = { id: String(Date.now()), name: newUser.name, loginName: newUser.loginName.trim().toLowerCase(), pin: String(newUser.pin), role: newUser.role, permissions: newUser.permissions };
      parsed.system_users.push(created);

      const putRes = await fetch(CLOUD_API_URL, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "إضافة مستخدم سحابي", content: btoa(unescape(encodeURIComponent(JSON.stringify(parsed, null, 2)))), sha: data.sha })
      });

      if (!putRes.ok) throw new Error();
      alert(`تم رفع حساب ${newUser.role} بنجاح إلى السحابة! 🎉`);
      fetchCloudUsers();
      setNewUser({ name: '', loginName: '', pin: '', role: 'معلم', permissions: { students: false, classes: false, teachers: false, finance: false, results: false } });
    } catch (err) {
      alert("فشل رفع البيانات للسحابة، تأكد من إعدادات الـ Token في فيرسيل");
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === '1' || userName === 'عثمان صديق') return alert("لا يمكن حذف حساب الأدمن الأساسي!");
    if (!window.confirm(`هل أنت متأكد من حذف "${userName}" نهائياً من السحابة؟`)) return;
    try {
      const getRes = await fetch(CLOUD_API_URL, { headers: { "Authorization": `Bearer ${GITHUB_TOKEN}` } });
      const data = await getRes.json();
      const parsed = JSON.parse(decodeURIComponent(escape(atob(data.content))));
      
      parsed.system_users = parsed.system_users.filter(u => String(u.id) !== String(userId));

      const putRes = await fetch(CLOUD_API_URL, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "حذف مستخدم سحابي", content: btoa(unescape(encodeURIComponent(JSON.stringify(parsed, null, 2)))), sha: data.sha })
      });

      if (!putRes.ok) throw new Error();
      alert("تم الحذف بنجاح من السحابة! 🗑️");
      fetchCloudUsers();
    } catch (err) {
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', width: '100%', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ flex: '1 1 350px', background: '#ffffff', padding: '25px', borderRadius: '20px', border: '1px solid #e1e8f0' }}>
        <h3 style={{ color: '#1a365d', margin: '0 0 15px 0', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', fontWeight: '800' }}>➕ إضافة مستخدم وتعيين الصلاحيات</h3>
        <form onSubmit={saveNewUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="الاسم الكامل" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1' }} required />
          <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff' }}>
            <option value="معلم">معلم</option><option value="إداري">إداري</option><option value="محاسب">محاسب</option><option value="أدمن">أدمن</option>
          </select>
          <input type="text" placeholder="اسم تسجيل الدخول" value={newUser.loginName} onChange={e => setNewUser({ ...newUser, loginName: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1' }} required />
          <input type="password" placeholder="كلمة المرور (PIN)" value={newUser.pin} onChange={e => setNewUser({ ...newUser, pin: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #cbd5e1' }} required />
          
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            {['students', 'classes', 'teachers', 'finance', 'results'].map(key => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={newUser.permissions[key]} onChange={() => handleCheckboxChange(key)} /> 
                {key === 'students' ? 'قسم الطلاب' : key === 'classes' ? 'قسم الفصول' : key === 'teachers' ? 'قسم المعلمين' : key === 'finance' ? 'قسم الحسابات' : 'قسم النتيجة'}
              </label>
            ))}
          </div>
          <button type="submit" style={{ background: '#1a365d', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>حفظ ورفع للسحابة</button>
        </form>
      </div>

      <div style={{ flex: '2 1 450px', background: '#ffffff', padding: '25px', borderRadius: '20px', border: '1px solid #e1e8f0', overflowX: 'auto' }}>
        <h3 style={{ color: '#1a365d', margin: '0 0 15px 0', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px', fontWeight: '800' }}>👥 صلاحيات الحسابات السحابية</h3>
        {loading ? <p style={{ textAlign: 'center', color: '#1a365d' }}>جاري جلب البيانات من السحابة...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '10px' }}>الاسم</th>
                <th style={{ padding: '10px' }}>الدور</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {systemUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: '600' }}>{u.name}</td>
                  <td style={{ padding: '10px' }}>{u.role}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <button onClick={() => handleDeleteUser(u.id, u.name)} style={{ background: '#fdf2f2', color: '#e74c3c', border: 'none', padding: '4px 10px', borderRadius: '8px', cursor: 'pointer' }}>🗑️ حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
