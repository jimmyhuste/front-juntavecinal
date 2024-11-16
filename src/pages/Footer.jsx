import React, { useState } from 'react';

const SERVICIOS = ['Solicitudes', 'Noticias'];
const REDES_SOCIALES = [
    { nombre: 'Facebook', url: 'https://facebook.com' },
    { nombre: 'Twitter', url: 'https://twitter.com' },
    { nombre: 'Instagram', url: 'https://instagram.com' }
];

const SeccionFooter = ({ titulo, children }) => (
    <div>
        <h2 className="text-lg font-semibold mb-4">{titulo}</h2>
        {children}
    </div>
);

const FormularioContacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario
        console.log('Formulario enviado:', formData);
        // Reiniciar el formulario
        setFormData({ nombre: '', email: '', mensaje: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">Nombre</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                />
            </div>
            <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-300">Mensaje</label>
                <textarea
                    id="mensaje"
                    name="mensaje"
                    rows="4"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                ></textarea>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Enviar
            </button>
        </form>
    );
};

export default function Footer() {
    const anioActual = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    <SeccionFooter titulo="Servicios">
                        <ul className="space-y-2">
                            {SERVICIOS.map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </SeccionFooter>

                    <SeccionFooter titulo="Contacto">
                        <ul className="space-y-2">
                            <li><b>Email:</b> contacto@juntavecinal.cl</li>
                            <li><b>Teléfono:</b> +56 221234567</li>
                            <li><b>Dirección:</b> Av. Libertador Bernardo O'Higgins 1234, Santiago, Chile</li>
                        </ul>
                    </SeccionFooter>

                    <SeccionFooter titulo="Apoya el Crecimiento de la Comunidad">
                        <ul className="space-y-2 mb-4">
                            <li className="flex items-center">
                                <a href="/register" className="text-gray-300 hover:text-indigo-500 transition-colors">
                                    Únete a Nuestra Comunidad
                                </a>
                            </li>

                            <li className="flex items-center">
                                <a href="/negocios-locales" className="text-gray-300 hover:text-white transition-colors">
                                    Apoyamos juntos para una mejor comunidad
                                </a>
                            </li>

                        </ul>
                    </SeccionFooter>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                    <div className="w-full h-96">
                        <iframe
                            title="Mapa de Santiago, Chile"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106551.15980596124!2d-70.6732714869692!3d-33.47278700953481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5410425af2f%3A0x8475d53c400f0931!2sSantiago%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile!5e0!3m2!1ses!2s!4v1652304762975!5m2!1ses!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Contáctanos</h2>
                        <FormularioContacto />
                    </div>
                </div>

                <div className="border-t border-gray-800 my-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm w-3/4">
                        &copy; {anioActual} Junta Vecinal Digital. Todos los derechos reservados. Este portal está diseñado para facilitar la comunicación entre los vecinos y la junta directiva, promover la participación comunitaria y ofrecer un acceso rápido y eficiente a trámites, eventos y noticias. Al utilizar este sitio, aceptas nuestros <a href="/terms-privacy" className="text-indigo-500 hover:underline">términos y condiciones</a> y nuestra <a href="/policy" className="text-indigo-500 hover:underline">política de privacidad</a>. Todos los contenidos y servicios están protegidos por las leyes aplicables.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        {REDES_SOCIALES.map(({ nombre, url }) => (
                            <a
                                key={nombre}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-indigo-500 transition-colors"
                            >
                                {nombre}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
}