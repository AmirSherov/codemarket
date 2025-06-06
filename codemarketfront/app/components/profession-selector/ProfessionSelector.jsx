import React, { useState, useEffect } from 'react';
import './ProfessionSelector.scss';
import { getProfessions } from '../../utilits/auth';

const ProfessionSelector = ({ selectedProfessions, onSelect }) => {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const result = await getProfessions();
        if (result.success) {
          setProfessions(result.professions);
        } else {
          setError(result.error);
        }
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке профессий:', err);
        setError('Не удалось загрузить список профессий. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchProfessions();
  }, []);

  const handleProfessionSelect = (professionId) => {
    onSelect(professionId);
  };

  if (loading) return <div className="loading-professions">Загрузка профессий...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profession-selector">
      <h3>Выберите вашу профессию</h3>
      <div className="professions-grid">
        {professions.map(profession => (
          <div
            key={profession.id}
            className={`profession-card ${selectedProfessions.includes(profession.id) ? 'active' : ''}`}
            onClick={() => handleProfessionSelect(profession.id)}
          >
            {profession.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionSelector; 