const normalizePath = (path) => {
  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

export const callSecureApi = (path, options = {}) => {
  const baseUrl = import.meta.env.VITE_SECURE_PROXY_URL;

  if (!baseUrl) {
    throw new Error('Secure proxy URL (VITE_SECURE_PROXY_URL) is not configured.');
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const url = `${normalizedBase}${normalizePath(path)}`;

  const fetchOptions = {
    credentials: 'include',
    ...options,
    headers: {
      'X-Requested-With': 'edu-future-app',
      ...(options.headers || {})
    }
  };

  return fetch(url, fetchOptions);
};
