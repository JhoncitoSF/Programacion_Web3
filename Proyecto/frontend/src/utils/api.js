const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('jps_token');
const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});
export const api = {
  get:    (r)    => fetch(`${BASE_URL}${r}`, { headers: headers() }).then(x => x.json()),
  post:   (r, b) => fetch(`${BASE_URL}${r}`, { method: 'POST',   headers: headers(), body: JSON.stringify(b) }).then(x => x.json()),
  put:    (r, b) => fetch(`${BASE_URL}${r}`, { method: 'PUT',    headers: headers(), body: JSON.stringify(b) }).then(x => x.json()),
  patch:  (r, b) => fetch(`${BASE_URL}${r}`, { method: 'PATCH',  headers: headers(), body: JSON.stringify(b) }).then(x => x.json()),
  delete: (r)    => fetch(`${BASE_URL}${r}`, { method: 'DELETE', headers: headers() }).then(x => x.json()),
};
