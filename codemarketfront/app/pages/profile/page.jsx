'use client';
import { useState, useEffect } from 'react';
import DashboardNavigation from '../../components/dashboard/navigation';
import { updateUserProfile, getUserData } from '../../utilits/auth';
import Loader from '../../components/loader';
import { useRouter } from 'next/navigation';
import './profile.scss';
import { logout } from '../../utilits/auth';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    company_name: '',
    company_position: '',
  });
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      const user = await getUserData();
      setUserData(user);
      if (user) {
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          birth_date: user.birth_date || '',
          company_name: user.company_name || '',
          company_position: user.company_position || '',
        });
      }
      setLoading(false);
    };
    fetchPageData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await updateUserProfile(formData);
      if (result.success) {
        setSuccessMessage('Профиль успешно обновлен!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(result.error || 'Ошибка при обновлении профиля');
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при обновлении профиля');
    } finally {
      setSaveLoading(false);
    }
  };

  const cancelEdit = () => {
    if (userData) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        birth_date: userData.birth_date || '',
        company_name: userData.company_name || '',
        company_position: userData.company_position || '',
      });
    }
    setIsEditing(false);
    setErrorMessage('');
  };
  const formatBirthDate = (dateString) => {
    if (!dateString) return 'Не указана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return 'Не указан';
    
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getUserInitials = () => {
    if (!userData) return '';
    
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (userData.username) {
      return userData.username[0].toUpperCase();
    }
    
    return '?';
  };
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  if (loading || !userData) {
    return <Loader />;
  }

  return (
    <div className="profile-page">
      <DashboardNavigation />
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-cover"></div>
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <span>{getUserInitials()}</span>
            </div>
          </div>
          <div className="profile-header-content">
            <h1 className="profile-name">{userData?.first_name} {userData?.last_name}</h1>
            <p className="profile-position">{userData?.company_position || 'Должность не указана'}</p>
            <div className="profile-header-actions">
              {!isEditing && (
                <button 
                  className="profile-edit-button" 
                  onClick={() => setIsEditing(true)}
                >
                  <span className="edit-icon"></span>Редактировать профиль
                </button>
              )}
              <button
                className="logout-button"
                onClick={handleLogout}
              >
                  Выйти
              </button>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="profile-message success">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="profile-message error">
            {errorMessage}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-main">
            {isEditing ? (
              <div className="profile-edit-form">
                <h2>Редактирование профиля</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first_name">Имя</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Введите имя"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last_name">Фамилия</label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Введите фамилию"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Введите email"
                        disabled
                      />
                      <small>Email нельзя изменить</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="birth_date">Дата рождения</label>
                      <input
                        type="date"
                        id="birth_date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company_name">Компания</label>
                      <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Введите название компании"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company_position">Должность</label>
                      <input
                        type="text"
                        id="company_position"
                        name="company_position"
                        value={formData.company_position}
                        onChange={handleChange}
                        placeholder="Введите должность"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-button" 
                      onClick={cancelEdit}
                      disabled={saveLoading}
                    >
                      Отмена
                    </button>
                    <button 
                      type="submit" 
                      className="save-button" 
                      disabled={saveLoading}
                    >
                      {saveLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="profile-info">
                <div className="profile-section">
                  <h2>Основная информация</h2>
                  <div className="profile-details">
                    <div className="profile-detail-item">
                      <div className="detail-label">Полное имя</div>
                      <div className="detail-value">{userData?.first_name} {userData?.last_name}</div>
                    </div>
                    <div className="profile-detail-item">
                      <div className="detail-label">Email</div>
                      <div className="detail-value">{userData?.email}</div>
                    </div>
                    <div className="profile-detail-item">
                      <div className="detail-label">Дата рождения</div>
                      <div className="detail-value">{formatBirthDate(userData?.birth_date)}</div>
                    </div>
                    <div className="profile-detail-item">
                      <div className="detail-label">Возраст</div>
                      <div className="detail-value">{calculateAge(userData?.birth_date)} лет</div>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h2>Профессиональная информация</h2>
                  <div className="profile-details">
                    <div className="profile-detail-item">
                      <div className="detail-label">Компания</div>
                      <div className="detail-value">{userData?.company_name || 'Не указана'}</div>
                    </div>
                    <div className="profile-detail-item">
                      <div className="detail-label">Должность</div>
                      <div className="detail-value">{userData?.company_position || 'Не указана'}</div>
                    </div>
                    <div className="profile-detail-item">
                      <div className="detail-label">Тип пользователя</div>
                      <div className="detail-value">
                        {userData?.user_type === 'job_seeker' ? 'Соискатель' : 
                         userData?.user_type === 'employer' ? 'Работодатель' : 'Не указан'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-section">
                  <h2>Профессиональные навыки</h2>
                  <div className="profile-skills">
                    {userData?.professions && userData.professions.length > 0 ? (
                      <div className="profile-detail-item">
                        <div className="detail-label">Профессии</div>
                        <div className="detail-value">
                          <div className="skill-tags">
                            {userData.professions.map(profession => (
                              <span key={profession.id} className="skill-tag profession">
                                {profession.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-detail-item">
                        <div className="detail-label">Профессии</div>
                        <div className="detail-value">Не указаны</div>
                      </div>
                    )}
                    
                    {userData?.technologies && userData.technologies.length > 0 ? (
                      <div className="profile-detail-item">
                        <div className="detail-label">Технологии</div>
                        <div className="detail-value">
                          <div className="skill-tags">
                            {userData.technologies.map(tech => (
                              <span key={tech.id} className="skill-tag technology" title={tech.name}>
                                {tech.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-detail-item">
                        <div className="detail-label">Технологии</div>
                        <div className="detail-value">Не указаны</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-sidebar">
            <div className="profile-card">
              <h3>Статистика</h3>
              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Отклики</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Просмотры</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Избранное</div>
                </div>
              </div>
            </div>
            
            <div className="profile-card">
              <h3>Контакты</h3>
              <div className="profile-contacts">
                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-info">{userData?.email}</div>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <h3>Навыки и технологии</h3>
              <div className="profile-skills-sidebar">
                {userData?.professions && userData.professions.length > 0 ? (
                  <div className="skills-section">
                    <h4>Профессии</h4>
                    <div className="skill-tags">
                      {userData.professions.map(profession => (
                        <span key={profession.id} className="skill-tag profession">
                          {profession.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="skills-section">
                    <h4>Профессии</h4>
                    <p className="no-skills">Не указаны</p>
                  </div>
                )}
                
                {userData?.technologies && userData.technologies.length > 0 ? (
                  <div className="skills-section">
                    <h4>Технологии</h4>
                    <div className="skill-tags">
                      {userData.technologies.map(tech => (
                        <span key={tech.id} className="skill-tag technology" title={tech.name}>
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="skills-section">
                    <h4>Технологии</h4>
                    <p className="no-skills">Не указаны</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
