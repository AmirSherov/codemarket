import React, { useState, useEffect } from 'react';
import './TechnologySelector.scss';
import { getTechnologiesByProfession } from '../../utilits/auth';

const TechnologySelector = ({ selectedProfessionId, selectedTechnologies, onSelect }) => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      if (!selectedProfessionId) {
        setTechnologies([]);
        setLoading(false);
        return;
      }
      
      try {
        const result = await getTechnologiesByProfession(selectedProfessionId);
        if (result.success) {
          setTechnologies(result.technologies);
        } else {
          setError(result.error);
        }
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке технологий:', err);
        setError('Не удалось загрузить список технологий. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, [selectedProfessionId]);

  const handleTechnologyToggle = (techId) => {
    let newSelectedTech;
    
    if (selectedTechnologies.includes(techId)) {
      newSelectedTech = selectedTechnologies.filter(id => id !== techId);
    } else {
      newSelectedTech = [...selectedTechnologies, techId];
    }
    
    onSelect(newSelectedTech);
  };

  if (!selectedProfessionId) {
    return <div className="no-profession-selected">Сначала выберите профессию</div>;
  }

  if (loading) return <div className="loading-technologies">Загрузка технологий...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="technology-selector">
      <h3>Выберите технологии, которыми вы владеете</h3>
      <div className="technologies-grid">
        {technologies.map(tech => (
          <div
            key={tech.id}
            className={`technology-card ${selectedTechnologies.includes(tech.id) ? 'active' : ''}`}
            onClick={() => handleTechnologyToggle(tech.id)}
          >
            {tech.name}
          </div>
        ))}
      </div>
      {technologies.length === 0 && (
        <div className="no-technologies">
          Для выбранной профессии нет доступных технологий
        </div>
      )}
    </div>
  );
};

export default TechnologySelector; 