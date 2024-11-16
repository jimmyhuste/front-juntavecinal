export default function Page404() {
    return (
      <main className="grid min-h-screen place-items-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Página no encontrada
          </h1>
          <p className="mt-6 text-lg leading-7 text-gray-600">
            Lo sentimos, no pudimos encontrar la página que buscas.
          </p>
  
          {/* Opción de ilustración */}
          <img
            src="/illustration.jpg" 
            alt="404 illustration"
            className="mx-auto mt-10 h-64 w-64 sm:h-80 sm:w-80 object-contain"
          />
  
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Regresar a la página de inicio
            </a>
            {/* <a href="/#footer" className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition duration-200 ease-in-out">
              Contactar soporte <span aria-hidden="true">&rarr;</span>
            </a> */}
          </div>
        </div>
      </main>
    );
  }
  