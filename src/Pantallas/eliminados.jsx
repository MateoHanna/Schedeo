import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TaskItem = ({ tarea, onRestore, onDelete }) => {
  return (
    <div className="relative">
      <div className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium">
              {tarea.nombre_tarea}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-1">{tarea.descripcion}</div>
        <div className="flex items-center justify-between mt-2">
          <span className={`px-2 py-1 text-xs rounded ${
            tarea.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
            tarea.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {tarea.prioridad}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onRestore(tarea.id)}
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Restaurar
            </button>
            <button
              onClick={() => onDelete(tarea.id)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Eliminar permanentemente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Eliminados = () => {
  const [tareasEliminadas, setTareasEliminadas] = useState([]);

  useEffect(() => {
    obtenerTareasEliminadas();
  }, []);

  const obtenerTareasEliminadas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/obtener-tareas-eliminadas', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setTareasEliminadas(response.data.tareas_eliminadas);
    } catch (error) {
      console.error('Error al obtener tareas eliminadas:', error);
      toast.error('Error al cargar las tareas eliminadas');
    }
  };

  const restaurarTarea = async (tareaId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/restaurar-tarea/${tareaId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setTareasEliminadas(tareasEliminadas.filter(tarea => tarea.id !== tareaId));
      toast.success('Tarea restaurada exitosamente');
    } catch (error) {
      console.error('Error al restaurar tarea:', error);
      toast.error('Error al restaurar la tarea');
    }
  };

  const eliminarPermanentemente = async (tareaId) => {
    if (window.confirm('¿Estás seguro de eliminar permanentemente esta tarea?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/eliminar-permanente/${tareaId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTareasEliminadas(tareasEliminadas.filter(tarea => tarea.id !== tareaId));
        toast.success('Tarea eliminada permanentemente');
      } catch (error) {
        console.error('Error al eliminar permanentemente:', error);
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-left mb-6">Tareas Eliminadas</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            {tareasEliminadas.map(tarea => (
              <TaskItem 
                key={tarea.id}
                tarea={tarea}
                onRestore={restaurarTarea}
                onDelete={eliminarPermanentemente}
              />
            ))}
            {tareasEliminadas.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No hay tareas eliminadas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eliminados;
