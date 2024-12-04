import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from '../context/ThemeContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const CreateNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { themes } = useTheme();
  const initialFormState = {
    title: '',
    description: '',
    source: '',
    author: '',
    publishedAt: '',
    dateVigencia: '',
    category: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [rol, setRol] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const handleBack = () => navigate(-1);

  const resetForm = () => {
    setFormData(initialFormState);
    setImageFile(null);
    setErrors({});
  };

  const checkUserRole = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const { rol } = decodedToken;
        setRol(rol);
        if (rol !== "1") {
          Swal.fire('Acceso Denegado', 'No tienes permiso para acceder a esta página.', 'error');
          navigate('/panel');
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "El título es obligatorio";
    } else if (formData.title.length < 10) {
      newErrors.title = "El título debe tener al menos 10 caracteres";
    }

    if (!formData.description) {
      newErrors.description = "La descripción es obligatoria";
    } else if (formData.description.length < 50) {
      newErrors.description = "La descripción debe tener al menos 50 caracteres";
    }

    if (!formData.source) {
      newErrors.source = "La fuente es obligatoria";
    } else if (formData.source.length < 3) {
      newErrors.source = "La fuente debe tener al menos 3 caracteres";
    } else if (formData.source.length > 50) {
      newErrors.source = "La fuente no puede exceder los 50 caracteres";
    }

    if (!formData.author) {
      newErrors.author = "El autor es obligatorio";
    } else if (formData.author.length < 3) {
      newErrors.author = "El autor debe tener al menos 3 caracteres";
    } else if (formData.author.length > 50) {
      newErrors.author = "El autor no puede exceder los 50 caracteres";
    }

    if (!formData.category) {
      newErrors.category = "La categoría es obligatoria";
    } else if (formData.category.length < 3) {
      newErrors.category = "La categoría debe tener al menos 3 caracteres";
    } else if (formData.category.length > 30) {
      newErrors.category = "La categoría no puede exceder los 30 caracteres";
    }

    const now = dayjs();
    const publishedAt = dayjs(formData.publishedAt);
    const dateVigencia = dayjs(formData.dateVigencia);

    if (!formData.dateVigencia) {
      newErrors.dateVigencia = "La fecha de vigencia es obligatoria";
    } else if (dateVigencia.isBefore(publishedAt)) {
      newErrors.dateVigencia = "La fecha de vigencia debe ser posterior a la fecha de publicación";
    }

    if (!isEditing && !imageFile) {
      newErrors.urlToImage = "La imagen es obligatoria";
    } else if (imageFile) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        newErrors.urlToImage = "Solo se permiten imágenes en formato JPG, PNG o WEBP";
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        newErrors.urlToImage = "La imagen no debe superar los 5MB";
      }
    }

    return newErrors;
  };

  const formatDateForAPIEdit = (dateString) => {
    const date = dayjs(dateString);
    return date.format('YYYY-MM-DDTHH:mm:ss');
  };

  const formatDateForAPICreate = (dateString) => {
    const date = dayjs(dateString);
    return date.format('YYYY-MM-DD HH:mm');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          urlToImage: "Solo se permiten imágenes en formato JPG, PNG o WEBP"
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          urlToImage: "La imagen no debe superar los 5MB"
        }));
        return;
      }
      setImageFile(file);
      setErrors(prev => ({ ...prev, urlToImage: '' }));
    }
  };

  useEffect(() => {
    checkUserRole();

    if (id) {
      setIsEditing(true);
      axios
        .get(`${BASE_URL}/obtener/noticia/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id }
        })
        .then((response) => {
          const { title, description, source, author, publishedAt, dateVigencia, category } = response.data;
          setFormData({
            title,
            description,
            source,
            author,
            publishedAt: dayjs(publishedAt).format('YYYY-MM-DDTHH:mm'),
            dateVigencia: dayjs(dateVigencia).format('YYYY-MM-DDTHH:mm'),
            category,
          });
        })
        .catch(() => {
          Swal.fire('Error', 'No se pudo cargar la noticia. Inténtalo más tarde.', 'error');
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value);
    });

    if (isEditing) {
      dataToSend.append('publishedAt', formatDateForAPIEdit(formData.publishedAt));
      dataToSend.append('dateVigencia', formatDateForAPIEdit(formData.dateVigencia));
    } else {
      dataToSend.append('publishedAt', formatDateForAPICreate(formData.publishedAt));
      dataToSend.append('dateVigencia', formatDateForAPICreate(formData.dateVigencia));
    }
    if (imageFile) dataToSend.append('urlToImage', imageFile);
    if (isEditing) dataToSend.append('id', id);

    try {
      const endpoint = isEditing
        ? `${BASE_URL}/editar/noticia/`
        : `${BASE_URL}/crear/noticias/`;

      await axios({
        method: isEditing ? 'PUT' : 'POST',
        url: endpoint,
        data: dataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      await Swal.fire({
        title: 'Éxito',
        text: `Noticia ${isEditing ? 'editada' : 'creada'} correctamente.`,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      if (!isEditing) {
        resetForm();
      }
      navigate('/panel');

    } catch (error) {
      Swal.fire('Error', error.response?.data?.error || 'Hubo un problema al procesar la solicitud.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto h-screen w-full" style={{ backgroundColor: themes.background }}>
      <div className="max-w-3xl rounded-lg p-8 mx-auto bg-gray-800">
        {isEditing && (
          <div className="mb-4 text-left">
            <button
              onClick={handleBack}
              className="rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700"
            >
              Volver
            </button>
          </div>
        )}

        <h2 className="mb-8 text-center text-2xl font-bold leading-9 text-white">
          {isEditing ? 'Editar noticia' : 'Crear una nueva noticia'}
        </h2>

        <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-white">Título</label>
            <div className="mt-2">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Ingrese un titulo de al menos 10 caracteres"
                value={formData.title}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-white">Descripción</label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                placeholder="Ingrese una descripción de al menos 10 caracteres"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium leading-6 text-white">Fuente</label>
            <div className="mt-2">
              <input
                id="source"
                name="source"
                placeholder="Ingrese la fuente de la noticia"
                type="text"
                value={formData.source}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium leading-6 text-white">Autor</label>
            <div className="mt-2">
              <input
                id="author"
                name="author"
                type="text"
                placeholder="Ingrese el nombre del autor"
                value={formData.author}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="publishedAt" className="block text-sm font-medium leading-6 text-white">Fecha de Publicación</label>
            <div className="mt-2">
              <input
                id="publishedAt"
                name="publishedAt"
                type="datetime-local"
                step="1"
                value={formData.publishedAt}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.publishedAt && <p className="text-red-500 text-xs mt-1">{errors.publishedAt}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="dateVigencia" className="block text-sm font-medium leading-6 text-white">Fecha de Vigencia</label>
            <div className="mt-2">
              <input
                id="dateVigencia"
                name="dateVigencia"
                type="datetime-local"
                step="1"
                value={formData.dateVigencia}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.dateVigencia && <p className="text-red-500 text-xs mt-1">{errors.dateVigencia}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium leading-6 text-white">Categoría</label>
            <div className="mt-2">
              <input
                id="category"
                name="category"
                type="text"
                placeholder="Ingrese la categoría de la noticia"
                value={formData.category}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="urlToImage" className="block text-sm font-medium leading-6 text-white">Imagen</label>
            <div className="mt-2">
              <input
                id="urlToImage"
                name="urlToImage"
                type="file"
                onChange={handleImageChange}
                className="block w-full rounded-md bg-gray-700 py-2 px-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {errors.urlToImage && <p className="text-red-500 text-xs mt-1">{errors.urlToImage}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </div>
              ) : (
                isEditing ? 'Actualizar Noticia' : 'Crear Noticia'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};