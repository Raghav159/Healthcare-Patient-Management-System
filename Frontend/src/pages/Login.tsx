// src/pages/Login.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter email"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            {...register('password', { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;