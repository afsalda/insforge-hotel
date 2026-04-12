import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
    text-center px-4">
      <Helmet>
        <title>Page Not Found – Al Baith Rest House</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-500 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link 
        to="/" 
        className="text-blue-600 underline text-sm"
      >
        Go back to homepage
      </Link>
    </div>
  );
}
