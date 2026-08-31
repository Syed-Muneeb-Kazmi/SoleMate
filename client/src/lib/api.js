const getApiUrl = () => {
  // Use the env var directly. It must already be the full API base URL
  // (e.g. https://solemate-production-55b6.up.railway.app/api).
  // We only strip a trailing slash to avoid double-slash in requests.
  const url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim().replace(/\/$/, '');
  return url;
};

const API_URL = getApiUrl();

class ApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, headers: customHeaders = {}, auth = true } = options;

  const headers = {
    ...customHeaders,
  };

  // Only set Content-Type for JSON bodies (not FormData)
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add auth token if available and auth is requested
  if (auth && typeof window !== 'undefined') {
    const token = localStorage.getItem('solemate_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);
  let data = {};

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = {};
    }
  } else {
    try {
      const text = await res.text();
      data = { message: text };
    } catch {
      data = {};
    }
  }

  if (!res.ok) {
    const errorDetail = data.error || (Array.isArray(data.errors) ? data.errors.join(', ') : '');
    const errorMessage = data.message && errorDetail && data.message !== errorDetail
      ? `${data.message} — ${errorDetail}`
      : (data.message || errorDetail || `Server returned error status ${res.status}`);

    throw new ApiError(
      errorMessage,
      res.status,
      data.errors || []
    );
  }

  return data;
}

// ─── Auth API ────────────────────────────────────────────
export const authAPI = {
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: data, auth: false }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: data, auth: false }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (data) => apiRequest('/auth/profile', { method: 'PUT', body: data }),
  updatePassword: (data) => apiRequest('/auth/password', { method: 'PUT', body: data }),
  forgotPassword: (data) => apiRequest('/auth/forgot-password', { method: 'POST', body: data, auth: false }),
  resetPassword: (token, data) => apiRequest(`/auth/reset-password/${token}`, { method: 'PUT', body: data, auth: false }),
};

// ─── Products API ────────────────────────────────────────
export const productsAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`, { auth: false });
  },
  getBySlug: (slug) => apiRequest(`/products/slug/${slug}`, { auth: false }),
  getById: (id) => apiRequest(`/products/${id}`, { auth: false }),
  getFeatured: () => apiRequest('/products/featured', { auth: false }),
  getNewArrivals: () => apiRequest('/products/new-arrivals', { auth: false }),
  getBrands: () => apiRequest('/products/brands', { auth: false }),
  create: (data) => apiRequest('/products', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/products/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  uploadImages: (id, formData) => apiRequest(`/products/${id}/images`, { method: 'POST', body: formData }),
};

// ─── Categories API ──────────────────────────────────────
export const categoriesAPI = {
  getAll: (tree = false) => apiRequest(`/categories${tree ? '?tree=true' : ''}`, { auth: false }),
  getById: (id) => apiRequest(`/categories/${id}`, { auth: false }),
  create: (data) => apiRequest('/categories', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/categories/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
};

// ─── Cart API ────────────────────────────────────────────
export const cartAPI = {
  get: () => apiRequest('/cart'),
  add: (data) => apiRequest('/cart/add', { method: 'POST', body: data }),
  update: (data) => apiRequest('/cart/update', { method: 'PUT', body: data }),
  remove: (itemId) => apiRequest(`/cart/remove/${itemId}`, { method: 'DELETE' }),
  clear: () => apiRequest('/cart/clear', { method: 'DELETE' }),
};

// ─── Orders API ──────────────────────────────────────────
export const ordersAPI = {
  place: (data) => apiRequest('/orders', { method: 'POST', body: data }),
  getMyOrders: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiRequest(`/orders/my-orders${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiRequest(`/orders/${id}`),
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiRequest(`/orders/all${query ? `?${query}` : ''}`);
  },
  updateStatus: (id, data) => apiRequest(`/orders/${id}/status`, { method: 'PUT', body: data }),
  getStats: () => apiRequest('/orders/stats'),
};

// ─── Users API (Admin) ──────────────────────────────────
export const usersAPI = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiRequest(`/users${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiRequest(`/users/${id}`),
  getDashboardStats: () => apiRequest('/users/stats/dashboard'),
};

// ─── Reviews API ─────────────────────────────────────────
export const reviewsAPI = {
  getForProduct: (productId, params = {}) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiRequest(`/reviews/product/${productId}${query ? `?${query}` : ''}`, { auth: false });
  },
  create: (data) => apiRequest('/reviews', { method: 'POST', body: data }),
  delete: (id) => apiRequest(`/reviews/${id}`, { method: 'DELETE' }),
};

// ─── Contact API ─────────────────────────────────────────
export const contactAPI = {
  submit: (data) => apiRequest('/contact', { method: 'POST', body: data, auth: false }),
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiRequest(`/contact${query ? `?${query}` : ''}`);
  },
  markAsRead: (id) => apiRequest(`/contact/${id}/read`, { method: 'PUT' }),
};

export { API_URL, ApiError };
