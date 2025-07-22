// Example: LoginPage.tsx
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Link } from 'react-router';
import Form, { FormGroup, FormLabel, FormInput, FormActions } from '../common/Form';
import { IconCircleDashedCheck, IconEye, IconEyeOff } from '@tabler/icons-react';
import LinearProgress from '../common/LinearProgress';
import Button from '../common/Button';
import PageTitle from '../common/PageTitle';
import { loginSchema } from '../../validation/authValidation';
import { useAuth } from '../../contexts/authContext';
import { useAlert } from '../../contexts/alertContext';
import useToggle from '../../hooks/useToggle';

const LoginPage: React.FC = () => {
  const { setAlert } = useAlert();
  const { login, loading, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const { value: showPassword, toggle: togglePassword } = useToggle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields using Yup
    try {
      await loginSchema.validate({ username, password }, { abortEarly: false });
      setFieldErrors({});
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const errors: typeof fieldErrors = {};
        err.inner.forEach((validationError) => {
          if (validationError.path) {
            errors[validationError.path as keyof typeof errors] = validationError.message;
          }
        });
        setFieldErrors(errors);
        return;
      }
    }

    try {
      await login(username, password);
      setAlert({
        message: 'Login successful!',
        type: 'success',
      });
    } catch (err: any) {
      // Replace setError with global alert
      setAlert({
        message: err?.response?.data?.detail || 'Invalid credentials',
        type: 'error',
      });
    }
  };

  if (isAuthenticated) {
    return (
      <div className="text-center mt-20 text-gray-500">
        <IconCircleDashedCheck stroke={1.5} size={64} className='mx-auto mb-3 text-green-800' />
        <span className='text-green-800'>You're already logged in!</span>
      </div>
    );
  }


  return (
    <div>
      <PageTitle
        title="Login"
      />
      <Form onSubmit={handleSubmit} className="sm:w-1/4 w-full mx-auto">
        {loading &&
          <LinearProgress
            position='absolute'
            thickness="h-1"
            duration={3000}
          />}
        <div className='flex flex-col gap-y-6'>
          <div className='space-y-1 text-center'>
            <FormLabel htmlFor="code">Good to See You Again!</FormLabel>
            <p className="text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">We won’t judge 😬</p>
          </div>
          <div>
            <FormGroup className='flex flex-col space-y-2'>
              <FormInput
                id="username"
                name="username"
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
              )}
            </FormGroup>
            <FormGroup className='flex flex-col space-y-2'>
              <div className='relative'>
                <FormInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  onClick={togglePassword}
                  variant="link"
                  icon={showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  iconOnly
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800"
                />
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </FormGroup>
            <div className="text-right">
              <Link
                to="/reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
        <FormActions className="space-y-3 flex flex-col">
          <Button
            type="submit"
            label={loading ? 'Logging in...' : 'Login'}
            onClick={() => { }}
            variant="primary"
            disabled={loading}
            fullWidth
          />
          <p className="text-center text-sm text-gray-600 mb-5">
            Don’t have an account?{' '}
            <Link
              to="/sign-up"
              className="text-blue-600 hover:underline"

            >
              Sign up
            </Link>
          </p>
        </FormActions>
      </Form>
    </div>

  );
};

export default LoginPage;
