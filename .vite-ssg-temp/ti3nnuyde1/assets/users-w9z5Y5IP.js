import { u as useApi } from "../main.mjs";
const api = useApi();
function buildQuery(params) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.tier) queryParams.set("tier", params.tier);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);
  return queryParams.toString();
}
async function requestUsers(url, params = {}) {
  const queryString = buildQuery(params);
  const response = await api.get(queryString ? `${url}?${queryString}` : url);
  return response.data;
}
async function getPublicUsers(params = {}) {
  return requestUsers("/users/public", params);
}
async function getModerationUsers(params = {}) {
  return requestUsers("/users", params);
}
async function updateUser(id, payload) {
  const response = await api.put(`/users/${id}`, payload);
  return response.data.user;
}
async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
export {
  getModerationUsers as a,
  deleteUser as d,
  getPublicUsers as g,
  updateUser as u
};
