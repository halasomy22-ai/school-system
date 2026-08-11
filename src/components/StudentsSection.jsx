import React, { useState, useEffect } from 'react';
import { addStudent, getAllStudents, deleteStudent } from '../db';

export default function StudentsSection() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuerySection, setShowQuerySection] = useState(false);

  const [selectedViewClass, setSelectedViewClass] = useState('الثالث ثانوي - المساق العلمي');
  const [selectedViewGender, setSelectedViewGender] = useState('ذكور');

  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('الأول ابتدائي');
  const [newGender, setNewGender] = useState('ذكور');

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data || []);
    } catch (error) {
      console.error("فشل تحميل البيانات:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert("الرجاء إدخال اسم الطالب كاملاً!");
      return;
    }
    
    try {
      const newStudent = {
        id: Date.now(), 
        name: newName.trim(),
        class: newClass,
        gender: newGender
      };
      
      await addStudent(newStudent);
      await loadStudentsData();
      
      setNewName('');
      setIsModalOpen(false);
      alert("تم حفظ بيانات الطالب بنجاح في قاعدة البيانات وتحديث المساق الدراسي 💾");
    } catch (error) {
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      try {
        await deleteStudent(id);
        setStudents(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        alert("فشل الحذف");
      }
    }
  };

  const displayedStudents = students.filter(s => 
    s && s.class === selectedViewClass && s.gender === selectedViewGender
  );

  const classOptions = [
    { group: "المرحلة الابتدائية", items: ["الأول ابتدائي", "الثاني ابتدائي", "الثالث ابتدائي", "الرابع ابتدائي", "الخامس ابتدائي", "السادس ابتدائي"] },
    { group: "المرحلة المتوسطة", items: ["الأول متوسط", "الثاني متوسط", "الثالث متوسط"] },
    { group: "المرحلة الثانوية", items: ["الأول ثانوي", "الثاني ثانوي", "الثالث ثانوي - المساق العلمي", "الثالث ثانوي - المساق الأدبي"] }
  ];

  return (
    <div style={{ padding: '15px 10px', direction: 'rtl', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ flex: '1 1 180px', maxWidth: '280px', padding: '14px 20px', cursor: 'pointer', backgroundColor: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(45, 106, 79, 0.2)', transition: 'all 0.2s' }}
        >
          ➕ إضافة طالب جديد
        </button>

        <button 
          onClick={() => setShowQuerySection(!showQuerySection)}
          style={{ flex: '1 1 180px', maxWidth: '280px', padding: '14px 20px', cursor: 'pointer', backgroundColor: showQuerySection ? '#dc3545' : '#15345d', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(21, 52, 93, 0.2)', transition: 'all 0.2s' }}
        >
          {showQuerySection ? '❌ إغلاق شاشة الاستعلام' : '🔍 شاشة الاستعلام والفرز'}
        </button>
      </div>

      {showQuerySection && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e3e6f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '30px', overflowX: 'auto' }}>
          <h3 style={{ marginTop: 0, color: '#15345d', marginBottom: '20px', fontSize: '17px', fontWeight: '800' }}>🔍 فلترة وبحث مخصص في قوائم الطلاب</h3>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#4a5568' }}>اختر الصف الدراسي:</label>
              <select value={selectedViewClass} onChange={(e) => setSelectedViewClass(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                {classOptions.map((g, idx) => (
                  <optgroup key={idx} label={g.group}>
                    {g.items.map((item, i) => <option key={i} value={item}>{item}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 150px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#4a5568' }}>النوع:</label>
              <select value={selectedViewGender} onChange={(e) => setSelectedViewGender(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}>
                <option value="ذكور">👦 بنين</option>
                <option value="إناث">👧 بنات</option>
              </select>
            </div>
          </div>

          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '500px' }}>
              <thead>
                <tr style={{ backgroundColor: '#15345d', color: '#fff', height: '40px' }}>
                  <th style={{ padding: '10px', borderRadius: '0 8px 8px 0' }}>اسم الطالب كاملاً</th>
                  <th style={{ padding: '10px' }}>الفصل الدراسي</th>
                  <th style={{ padding: '10px' }}>الجنس</th>
                  <th style={{ padding: '10px', borderRadius: '8px 0 0 8px' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.length > 0 ? displayedStudents.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #e3e6f0', height: '45px' }}>
                    <td style={{ fontWeight: '700', textAlign: 'right', padding: '10px 15px', color: '#2d3748' }}>{s.name}</td>
                    <td style={{ color: '#b45309', fontWeight: '700', padding: '10px' }}>{s.class}</td>
                    <td style={{ padding: '10px' }}>{s.gender === 'ذكور' ? '👦 بنين' : '👧 بنات'}</td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => handleDelete(s.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>حذف 🗑️</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '30px', color: '#718096', fontStyle: 'italic', textAlign: 'center' }}>لا يوجد طلاب مقيدين في هذا البحث حالياً.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '15px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '450px', borderRadius: '24px', padding: '25px', boxSizing: 'border-box', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e3e6f0', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#15345d', fontSize: '18px', fontWeight: '800' }}>➕ قيد طالب جديد في المنظومة</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#a0aec0' }}>&times;</button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#4a5568' }}>اسم الطالب رباعي:</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="أدخل الاسم الكامل للطالب" 
                  required 
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#4a5568' }}>الصف الدراسي المسجل:</label>
                <select value={newClass} onChange={(e) => setNewClass(e.target.value)} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }}>
                  {classOptions.map((g, idx) => (
                    <optgroup key={idx} label={g.group}>
                      {g.items.map((item, i) => <option key={i} value={item}>{item}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '13px', color: '#4a5568' }}>الجنس الفعلي:</label>
