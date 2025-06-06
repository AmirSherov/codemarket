import React from 'react';
import './UserTypeSelector.scss';

const UserTypeSelector = ({ selectedType, onSelect }) => {
  return (
    <div className="user-type-selector">
      <h3>Я на CodeMarket</h3>
      <div className="user-type-options">
        <div 
          className={`user-type-option ${selectedType === 'job_seeker' ? 'active' : ''}`}
          onClick={() => onSelect('job_seeker')}
        >
          <div className="option-icon"><img src="/icons/job.png" alt="Ищу работу" /></div>
          <div className="option-text">Ищу работу</div>
        </div>
        
        <div 
          className={`user-type-option ${selectedType === 'employer' ? 'active' : ''}`}
          onClick={() => onSelect('employer')}
        >
          <div className="option-icon"><img src="/icons/employer.png" alt="Предлагаю работу" /></div>
          <div className="option-text">Предлагаю работу</div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector; 