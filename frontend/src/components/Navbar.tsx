import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-700';

  return (
    <nav className="bg-white shadow p-4 flex gap-6 justify-center">
      <Link to="/" className={isActive('/')}>
        Home
      </Link>
      <Link to="/cadastro" className={isActive('/cadastro')}>
        Cadastrar Motorista
      </Link>
      <Link to="/lista" className={isActive('/lista')}>
        Listar Motoristas
      </Link>
    </nav>
  );
}
