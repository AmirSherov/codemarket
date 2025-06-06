import React from 'react';
import './EmployerForm.scss';

const EmployerForm = ({ formData, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="employer-form">
      <h3>Информация о компании</h3>
      
      <div className="form-group">
        <label htmlFor="company_name">Название компании (опционально)</label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          value={formData.company_name || ''}
          onChange={handleChange}
          placeholder="Введите название вашей компании"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="company_position">Ваша должность</label>
        <input
          type="text"
          id="company_position"
          name="company_position"
          value={formData.company_position || ''}
          onChange={handleChange}
          placeholder="Введите вашу должность"
        />
      </div>
    </div>
  );
};

export default EmployerForm; 