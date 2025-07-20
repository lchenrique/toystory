import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirecionar se o usuário já estiver autenticado (apenas se não estiver carregando)
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate, authLoading]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setLoginError(null);

      await login(data.email, data.password);
      
      // O redirecionamento será feito pelo useEffect quando o estado for atualizado
      // Não precisamos fazer redirecionamento manual aqui
    } catch (error: any) {
      console.error('Login component: Login error:', error);
      setLoginError(error.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">TS</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta
          </h2>
          <p className="text-gray-600">
            Entre na sua conta da Loja de Brinquedos
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}
        
        {loginError && (
          <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {loginError}
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="card">
          <div className="card-body">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="form-label">
                  Endereço de email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
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
                    className="form-input pl-10"
                    placeholder="Digite seu email"
                  />
                </div>
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register('password', { required: 'Senha é obrigatória' })}
                    className="form-input pl-10"
                    placeholder="Digite sua senha"
                  />
                </div>
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Lembrar de mim
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Crie uma agora
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Ao entrar, você concorda com nossos{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Termos de Serviço</a>
            {' '}e{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;