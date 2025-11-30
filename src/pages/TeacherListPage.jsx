import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Filter, X, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import GlobalHeader from '../components/GlobalHeader';
import { useLanguage } from '../contexts/LanguageContext';

const TeacherListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // Fetch teachers and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch subjects first
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('id, name')
          .order('name');
        
        if (subjectsError) throw subjectsError;
        setSubjects(subjectsData);
        
        // Fetch teachers with their subjects
        const { data: teachersData, error: teachersError } = await supabase
          .from('profiles')
          .select(`
            id, 
            first_name, 
            last_name, 
            phone_number,
            teacher_subjects(
              subject_id,
              subjects(name)
            )
          `)
          .eq('role', 'teacher');
        
        if (teachersError) throw teachersError;
        setTeachers(teachersData);
      } catch {
        setError('Nie udało się pobrać listy nauczycieli');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter teachers based on search query and selected subject
  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.first_name} ${teacher.last_name}`.toLowerCase();
    const matchesSearch = searchQuery === '' || fullName.includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === '' || 
      teacher.teacher_subjects.some(ts => ts.subject_id === selectedSubject);
    
    return matchesSearch && matchesSubject;
  });
  
  // Handle teacher selection
  const handleTeacherClick = (teacherId) => {
    navigate(`/teacher/${teacherId}`);
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('');
  };
  
  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || selectedSubject !== '';
  
  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <GlobalHeader 
        title={t('findTeacher')}
        showBackButton={true}
        onBack={() => navigate('/cockpit')}
      />
      
      <div className="flex-1 p-4 md:p-6 mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="bg-bg-card rounded-xl p-4 md:p-6 shadow-lg border border-bg-neutral mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchTeacherPlaceholder')}
                    className="w-full p-3 pl-10 border border-bg-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-color/50 w-5 h-5" />
                </div>
              </div>
              
              {/* Subject filter */}
              <div className="md:w-1/3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 border border-bg-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/50 appearance-none bg-white"
                >
                  <option value="">{t('allSubjects')}</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Clear filters button - only show if filters are active */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="md:w-auto px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>{t('clearFilters')}</span>
                </button>
              )}
            </div>
            
            {/* Active filters display */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <div className="bg-accent-primary/10 text-accent-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="mr-1">{t('search')}:</span>
                    <span className="font-medium">{searchQuery}</span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-accent-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {selectedSubject && (
                  <div className="bg-accent-primary/10 text-accent-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span className="mr-1">{t('subject')}:</span>
                    <span className="font-medium">
                      {subjects.find(s => s.id === selectedSubject)?.name}
                    </span>
                    <button 
                      onClick={() => setSelectedSubject('')}
                      className="ml-2 hover:text-accent-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Teachers list */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mb-4"></div>
              <p className="text-text-color/70">{t('loadingTeachers')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-red-600 hover:text-red-800 underline"
              >
                {t('tryAgain')}
              </button>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <Filter className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-blue-700 font-medium mb-2">{t('noTeachersFound')}</p>
              <p className="text-blue-600 text-sm mb-4">{t('tryDifferentFilters')}</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map(teacher => (
                <div
                  key={teacher.id}
                  onClick={() => handleTeacherClick(teacher.id)}
                  className="bg-bg-card rounded-xl p-6 shadow-lg border border-bg-neutral hover:border-accent-primary/50 transition-all cursor-pointer hover:shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Teacher avatar */}
                    <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center text-accent-primary text-xl font-bold">
                      {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-text-color text-lg">
                        {teacher.first_name} {teacher.last_name}
                      </h3>
                      <p className="text-text-color/70 text-sm">
                        {t('teacher')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subjects */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-color/70 mb-2 flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {t('teachesSubjects')}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.teacher_subjects.length > 0 ? (
                        teacher.teacher_subjects.map((ts, index) => (
                          <span 
                            key={index}
                            className="bg-accent-secondary/10 text-accent-secondary px-2 py-1 rounded-md text-xs"
                          >
                            {ts.subjects.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-text-color/50 text-xs italic">
                          {t('noSubjectsAssigned')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* View profile button */}
                  <button
                    className="w-full bg-nav-bg text-white py-2 px-4 rounded-lg hover:bg-nav-bg/90 transition-colors text-sm font-medium"
                  >
                    {t('viewAvailability')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherListPage;