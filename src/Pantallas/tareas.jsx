import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre_tarea: task.nombre_tarea,
    descripcion: task.descripcion,
    fecha_vencimiento: task.fecha_vencimiento,
    prioridad: task.prioridad,
    completada: task.completada
  });

  const truncateText = (text, limit = 10) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/editar-tarea/${task.id}`,
        editForm,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        onUpdate(response.data.tarea);
        setShowEditForm(false);
      }
    } catch (error) {
      console.error('Error al editar tarea:', error);
      alert('Error al editar la tarea');
    }
  };

  const handleToggleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/editar-tarea/${task.id}`,
        {
          ...editForm,
          completada: !editForm.completada
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setEditForm(prev => ({...prev, completada: !prev.completada}));
        onUpdate(response.data.tarea);
      }
    } catch (error) {
      console.error('Error al actualizar estado de la tarea:', error);
      alert('Error al actualizar el estado de la tarea');
    }
  };

  return (
    <div className="relative">
      <div 
        className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowEditForm(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`font-medium ${editForm.completada ? 'line-through text-gray-500' : ''}`}>
              {truncateText(task.nombre_tarea)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-2">
          <span className={`px-2 py-1 text-xs rounded ${
            task.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
            task.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.prioridad}
          </span>
        </div>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Editar Tarea</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={editForm.nombre_tarea}
                    onChange={(e) => setEditForm({...editForm, nombre_tarea: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={editForm.descripcion}
                    onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                  <select
                    value={editForm.prioridad}
                    onChange={(e) => setEditForm({...editForm, prioridad: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.completada}
                    onChange={(e) => setEditForm({...editForm, completada: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Completada</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas mover esta tarea a la papelera?')) {
                      onDelete(task.id);
                      setShowEditForm(false);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const TasksPage = () => {
  const [currentSection, setCurrentSection] = useState('Tareas');
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('week');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskDate, setNewTaskDate] = useState(null);
  const [taskForm, setTaskForm] = useState({
    nombre_tarea: '',
    descripcion: '',
    fecha_vencimiento: '',
    prioridad: 'media',
    completada: false
  });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/obtener-tareas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        setTasks(response.data.tareas);
      }
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleAddTask = (date) => {
    setNewTaskDate(date);
    setTaskForm({
      nombre_tarea: '',
      descripcion: '',
      fecha_vencimiento: date.toISOString().split('T')[0],
      prioridad: 'media',
      completada: false
    });
    setShowAddTaskModal(true);
  };

  const handleSubmitNewTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/crear-tarea',
        taskForm,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setTasks(prevTasks => [...prevTasks, response.data.tarea]);
        setShowAddTaskModal(false);
        setNewTaskDate(null);
        setTaskForm({
          nombre_tarea: '',
          descripcion: '',
          fecha_vencimiento: '',
          prioridad: 'media',
          completada: false
        });
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert('Error al crear la tarea');
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setTaskForm({
      nombre_tarea: task.nombre_tarea,
      descripcion: task.descripcion,
      fecha_vencimiento: task.fecha_vencimiento,
      prioridad: task.prioridad,
      completada: task.completada
    });
    setShowEditModal(true);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (!window.confirm('¿Estás seguro de que deseas mover esta tarea a la papelera?')) {
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.delete(
        `http://localhost:5000/eliminar-tarea/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setShowEditModal(false);
        setSelectedTask(null);
        alert('Tarea movida a papelera exitosamente');
      }
    } catch (error) {
      console.error('Error detallado:', error.response || error);
      if (error.response?.status === 404) {
        alert('Tarea no encontrada o sin permiso para eliminarla');
      } else {
        alert(error.response?.data?.message || 'Error al mover la tarea a papelera');
      }
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/editar-tarea/${selectedTask.id}`,
        {
          ...taskForm,
          fecha_vencimiento: selectedTask.fecha_vencimiento
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === selectedTask.id ? response.data.tarea : task
          )
        );
        setShowEditModal(false);
        setSelectedTask(null);
        setTaskForm({
          nombre_tarea: '',
          descripcion: '',
          fecha_vencimiento: '',
          prioridad: 'media',
          completada: false
        });
      }
    } catch (error) {
      console.error('Error al editar tarea:', error);
      alert('Error al editar la tarea');
    }
  };

  const handleDateChange = (direction) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      switch (viewMode) {
        case 'week':
          newDate.setDate(prevDate.getDate() + (direction === 'next' ? 7 : -7));
          break;
        case 'month':
          newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1));
          break;
        case 'year':
          newDate.setFullYear(prevDate.getFullYear() + (direction === 'next' ? 1 : -1));
          break;
      }
      return newDate;
    });
  };

  // Funciones de renderizado
  const renderWeeklyCalendar = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);
          const dateStr = date.toISOString().split('T')[0];
          const isToday = date.getDate() === today.getDate() && 
                         date.getMonth() === today.getMonth() &&
                         date.getFullYear() === today.getFullYear();

          const dayTasks = tasks.filter(task => 
            task.fecha_vencimiento && task.fecha_vencimiento.split('T')[0] === dateStr
          );

          return (
            <div 
              key={day}
              className={`flex-1 min-h-[200px] p-4 border rounded-lg ${
                isToday ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="font-medium mb-2">{day}</div>
              <div className="text-lg">{date.getDate()}</div>
              <div className="text-sm text-gray-500 mb-3">
                {date.toLocaleString('default', { month: 'short' })}
              </div>
              
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onEdit={handleEditTask} 
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                  />
                ))}
              </div>

              <button 
                onClick={() => handleAddTask(date)}
                className={`mt-2 p-1 rounded-full ${
                  isToday ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthlyCalendar = () => {
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayWeekday = firstDayOfMonth.getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weeks = [];
    let week = Array(7).fill(null);

    for (let i = 0; i < firstDayWeekday; i++) {
      week[i] = null;
    }

    days.forEach((day, index) => {
      const dayIndex = (firstDayWeekday + index) % 7;
      week[dayIndex] = day;

      if (dayIndex === 6 || index === days.length - 1) {
        weeks.push([...week]);
        week = Array(7).fill(null);
      }
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-medium py-2">{day}</div>
        ))}
        {weeks.map((week, weekIndex) => (
          week.map((day, dayIndex) => {
            if (day === null) return <div key={`empty-${weekIndex}-${dayIndex}`} className="p-2" />;
            
            const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayTasks = tasks.filter(task => 
              task.fecha_vencimiento && task.fecha_vencimiento.split('T')[0] === dateStr
            );

            return (
              <div
                key={`day-${day}`}
                className={`p-2 min-h-[100px] border rounded cursor-pointer ${
                  dayTasks.length > 0 ? 'bg-blue-50' : 'bg-white'
                }`}
                onClick={() => handleAddTask(currentDate)}
              >
                <div className="font-medium">{day}</div>
                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className="text-xs p-1 bg-white rounded shadow cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTask(task);
                      }}
                    >
                      {task.nombre_tarea}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ))}
      </div>
    );
  };

  const renderYearlyOverview = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(selectedDate.getFullYear(), i, 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        index: i
      };
    });

    return (
      <div className="grid grid-cols-4 gap-4">
        {months.map(month => {
          const monthTasks = tasks.filter(task => {
            const taskDate = new Date(task.fecha_vencimiento);
            return taskDate.getMonth() === month.index && 
                   taskDate.getFullYear() === selectedDate.getFullYear();
          });

          return (
            <div
              key={month.name}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedDate(new Date(selectedDate.getFullYear(), month.index, 1));
                setViewMode('month');
              }}
            >
              <div className="font-medium mb-2">{month.name}</div>
              <div className="text-sm text-gray-600">
                {monthTasks.length} tareas
              </div>
              <div className="mt-2 space-y-1">
                {monthTasks.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    className="text-xs p-1 bg-gray-50 rounded"
                  >
                    {task.nombre_tarea}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTasksList = () => {
    const groupedTasks = tasks.reduce((groups, task) => {
      const date = task.fecha_vencimiento?.split('T')[0] || 'Sin fecha';
      if (!groups[date]) groups[date] = [];
      groups[date].push(task);
      return groups;
    }, {});

    return (
      <div className="space-y-6">
        {Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <div key={date} className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-medium mb-3">
              {date === 'Sin fecha' ? date : new Date(date).toLocaleDateString()}
            </h3>
            <div className="space-y-2">
              {dateTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEditTask} 
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTasksHeader = () => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Tareas</h1>
            <div className="text-xl text-gray-600">
              {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          
          {/* Controles de navegación temporal */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleDateChange('prev')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Hoy
              </button>
              <button
                onClick={() => handleDateChange('next')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Selector de vista */}
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="border rounded p-2"
            >
              <option value="week">Semana</option>
              <option value="month">Mes</option>
              <option value="year">Año</option>
              <option value="list">Lista</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderTasksContent = () => {
    switch (viewMode) {
      case 'week':
        return renderWeeklyCalendar();
      case 'month':
        return renderMonthlyCalendar();
      case 'year':
        return renderYearlyOverview();
      case 'list':
        return renderTasksList();
      default:
        return renderWeeklyCalendar();
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar onSectionChange={handleSectionChange} />
      <div className="flex-1 p-6">
        {renderTasksHeader()}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderTasksContent()}
        </div>
      </div>

      {/* Modal para agregar nueva tarea */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Nueva Tarea</h3>
            <form onSubmit={handleSubmitNewTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={taskForm.nombre_tarea}
                    onChange={(e) => setTaskForm({...taskForm, nombre_tarea: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={taskForm.descripcion}
                    onChange={(e) => setTaskForm({...taskForm, descripcion: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                  <select
                    value={taskForm.prioridad}
                    onChange={(e) => setTaskForm({...taskForm, prioridad: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTaskModal(false);
                    setNewTaskDate(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;