'use client'

import { LightBulbIcon, GlobeAltIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function About() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl w-4/5"> {/* Modificado para ocupar el 80% */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">Acerca de Nuestro Sistema de Gestión</h2>
          <div className="mt-4 text-lg leading-8 text-gray-300 text-center flex flex-col sm:flex-row justify-center items-center">
            <p className="max-w-xl mb-4 sm:mb-0">
              Nuestro Sistema de Gestión para la Unidad Territorial de la Junta de Vecinos está diseñado para mejorar la interacción y la eficiencia en la administración de actividades comunitarias. Con una interfaz intuitiva y funcionalidades completas, buscamos facilitar la participación de todos los vecinos en la toma de decisiones.
            </p>
            {/* <img src="/blog.jpg" alt="Descripción de la imagen" className="w-64 h-64 object-cover rounded-lg ml-0 sm:ml-4" /> */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 mt-10 sm:grid-cols-2 md:grid-cols-3">
          {/* Tarjeta de Misión */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <LightBulbIcon aria-hidden="true" className="h-8 w-8 text-indigo-500" />
              <h3 className="ml-3 text-xl font-semibold text-white">Misión</h3>
            </div>
            <p className="mt-2 text-md leading-6 text-gray-400">
              Nuestra misión es promover la colaboración entre los vecinos y garantizar un acceso equitativo a la información y los recursos disponibles en nuestra comunidad.
            </p>
          </div>

          {/* Tarjeta de Visión */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <GlobeAltIcon aria-hidden="true" className="h-8 w-8 text-indigo-500" />
              <h3 className="ml-3 text-xl font-semibold text-white">Visión</h3>
            </div>
            <p className="mt-2 text-md leading-6 text-gray-400">
              Aspiramos a ser un referente en la gestión comunitaria, donde cada vecino se sienta escuchado y pueda contribuir activamente al bienestar de todos.
            </p>
          </div>

          {/* Tarjeta de Objetivo */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <CheckCircleIcon aria-hidden="true" className="h-8 w-8 text-indigo-500" />
              <h3 className="ml-3 text-xl font-semibold text-white">Objetivo</h3>
            </div>
            <p className="mt-2 text-md leading-6 text-gray-400">
              El objetivo principal es facilitar la comunicación entre los vecinos y la junta directiva, gestionar trámites y solicitudes de manera eficiente, promover eventos y actividades comunitarias, y proveer información relevante y actualizada sobre la comunidad.
            </p>
          </div>


        </div>
      </div>

      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
    </div>
  )
}
