import apiClient from '../api/client';

export const requestResetCode = (email: string) =>
    apiClient.post('/password/forgot', { email });

export const verifyResetCode = (email: string, code: string) =>
    apiClient.post('/password/verify-code', { email, code });

export const resetPassword = (email: string, new_password: string) =>
    apiClient.post('/password/reset', { email, new_password });
