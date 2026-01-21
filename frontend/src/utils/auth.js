export const getToken = () => {
    return localStorage.getItem("token");
}

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export const isLoggedIn = () => !!getToken();

export const isAdmin = () => getUser()?.role === 'admin';

export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
}