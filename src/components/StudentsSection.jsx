import React, { useState, useEffect } from 'react';
import { addStudent, getAllStudents, deleteStudent } from '../db';

export default function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [viewClass, setViewClass] = useState('الثالث ثانوي - المساق العلمي');
  const [viewGender, setViewGender] = useState('ذكور');
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('الأول ابتدائي');
  const [newGender, setNewGender] = useState('ذكور');

  useEffect(() => { loadData(); }, []);
  const loadData = async () => { const data = await getAllStudents(); setStudents(data || []); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await addStudent({ id: Date.now(), name: newName.trim(), class: newClass, gender: newGender });
      await loadData();
      setNewName('');
      setIsModalOpen(false);
      alert("تم حفظ بيانات الطالب بنجاح 💾");
    } catch { alert("حدث خطأ في الحفظ"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      await deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const displayed = students.filter(s => s && s.class === viewClass && s.gender === viewGender);
  const classes = ["الأول ابتدائي", "الثاني ابتدائي", "الثالث ابتدائي", "الرابع ابتدائي", "الخامس ابتدائي", "السادس ابتدائي", "الأول متوسط", "الثاني متوسط", "الثالث متوسط", "الأول ثانوي", "الثاني ثانوي", "الثالث ثانوي - المساق العلمي", "الثالث ثانوي - المساق الأدبي"];

  return (
    <div style={{ padding: '15px 10px', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsModalOpen(true)} style={{ padding: '12px 20px', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>➕ إضافة طالب جديد</button>
        <button onClick={() => setShowQuery(!showQuery)} style={{ padding: '12px 20px', backgroundColor: '#15345d', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🔍 شاشة الاستعلام</button>
      </div>

      {showQuery && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e3e6f0', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '700' }}>الصف الدراسي:</label>
              <select value={viewClass} onChange={e => setViewClass(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
                {classes.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '700' }}>النوع:</label>
              <select value={viewGender} onChange={e => setViewGender(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
                <option value="ذكور">👦 بنين</option>
                <option value="إناث">👧 بنات</option>
              </select>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr style={{ backgroundColor: '#15345d', color: '#fff', height: '40px' }}>
                <th>اسم الطالب</th>
                <th>الصف</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length > 0 ? displayed.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #e3e6f0', height: '45px' }}>
                  <td>{s.name}</td>
                  <td>{s.class}</td>
                  <td><button onClick={() => handleDelete(s.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>حذف 🗑️</button></td>
                </tr>
              )) : <tr><td colSpan="3" style={{ padding: '20px', color: '#718096' }}>لا يوجد طلاب مقيدين.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', width: '90%', maxWidth: '400px', borderRadius: '24px', padding: '25px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#15345d' }}>➕ قيد طالب جديد</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="اسم الطالب رباعي" required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <select value={newClass} onChange={e => setNewClass(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                {classes.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <select value={newGender} onChange={e => setNewGender(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="ذكور">👦 بنين</option>
                <option value="إناث">👧 بنات</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#2d6a4f', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>حفظ</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
