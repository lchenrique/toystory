import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../services/userService';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setRegisterError('As senhas não coincidem');
      return;
    }

    try {
      setIsLoading(true);
      setRegisterError(null);
      
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data;
      
      await userService.createUser(userData);
      
      // Redirect to login page after successful registration
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Por favor, faça login.' } });
    } catch (error: any) {
      setRegisterError(error.response?.data?.message || 'Falha no cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Criar uma Conta</h1>
          <p className="mt-2 text-gray-600">Cadastre-se para acessar a Loja de Brinquedos</p>
        </div>
        
        {registerError && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {registerError}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="name" className="form-label">
              Nome Completo
            </label>
            <input
              id="name"
              {...register('name', { required: 'Nome completo é obrigatório' })}
              className="form-input"
              placeholder="João Silva"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Endereço de email inválido'
                }
              })}
              className="form-input"
              placeholder="joao@exemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { 
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres'
                }
              })}
              className="form-input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                required: 'Por favor, confirme sua senha',
                validate: value => value === watch('password') || 'As senhas não coincidem'
              })}
              className="form-input"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;