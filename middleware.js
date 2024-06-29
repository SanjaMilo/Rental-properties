// Protecting routes from unauthorized users 

export { default } from 'next-auth/middleware';

// Match any URLs we want to protect
export const config = {
    matcher: ['/properties/add', '/profile', '/properties/saved', '/messages']
};