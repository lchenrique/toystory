import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-4 flex-shrink-0">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Loja de Brinquedos. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;