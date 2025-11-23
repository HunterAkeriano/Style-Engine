import { u as useApi, g as getCookie, A as AUTH_TOKEN_KEY } from "../main.mjs";
const api = useApi();
function authHeaders() {
  const token = getCookie(AUTH_TOKEN_KEY);
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
async function listSaves(category) {
  const response = await api.get(`/saves/${category}s`, {
    headers: authHeaders()
  });
  return response.data.items;
}
async function requestPublish(category, id) {
  const response = await api.post(`/saves/${category}s/${id}/publish`, void 0, {
    headers: authHeaders()
  });
  return response.data.item;
}
async function listPublicSaves(category) {
  const response = await api.get(`/saves/public/${category}s`);
  return response.data.items;
}
async function listPendingModeration() {
  const response = await api.get("/moderation/pending", {
    headers: authHeaders()
  });
  return response.data.items;
}
async function createSave(category, name, payload) {
  const response = await api.post(
    `/saves/${category}s`,
    { name, payload },
    { headers: authHeaders() }
  );
  return response.data.item;
}
async function deleteSave(category, id) {
  await api.delete(`/saves/${category}s/${id}`, {
    headers: authHeaders()
  });
}
export {
  listSaves as a,
  listPendingModeration as b,
  createSave as c,
  deleteSave as d,
  listPublicSaves as l,
  requestPublish as r
};
