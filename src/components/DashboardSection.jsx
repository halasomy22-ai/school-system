import React from 'react';

const DashboardSection = ({ selectedUser, handlePermissionChange, playHover }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', direction: 'rtl' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '24px', flex: '1 1 300px', border: '1px solid #eaddf2' }}>
          <h4 style={{ marginTop: 0, color: '#3d145a', borderBottom: '1px solid #eaddf2', paddingBottom: '10px', fontWeight: '700' }}>لوحة الصلاحيات والبيانات</h4>
          {selectedUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'linear-gradient(90deg, #f4f0f8 0%, #ffffff 100%)', padding: '14px', borderRadius: '16px', borderRight: '4px solid #5c2483' }}>
                <h5 style={{ margin: 0, color: '#5c2483', fontSize: '14px' }}>المستخدم النشط: {selectedUser.name}</h5>
                <p style={{ direction: 'ltr', textAlign: 'right', margin: '5px 0 0 0', fontSize: '12px', color: '#7a6687' }}>User: {selectedUser.loginName} | Pin: {selectedUser.pin}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { key: 'students', label: 'دخول وإدارة قسم الطلاب' },
                  { key: 'classes', label: 'دخول وإدارة قسم الفصول' },
                  { key: 'teachers', label: 'دخول وإدارة قسم المعلمين' },
                  { key: 'finance', label: 'دخول الأقسام المالية والحسابات' },
                  { key: 'admin', label: 'صلاحية الأدمن والإدارة العليا' }
                ].map(item => (
                  <label key={item.key} onMouseEnter={playHover} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px 16px', background: '#f4f0f8', borderRadius: '20px' }}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedUser.permissions?.[item.key]} 
                      onChange={(e) => handlePermissionChange(item.key, e.target.checked)}
                      style={{ accentColor: '#5c2483', width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#3d145a', fontWeight: '500' }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#7a6687', fontSize: '14px', margin: '20px 0' }}>برجاء اختيار مستخدم لعرض صلاحياته</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardSection;
