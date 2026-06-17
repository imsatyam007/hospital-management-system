export const getRole = () => {
  const role = localStorage.getItem("role") || ""
  return role.replace("ROLE_", "") // "ROLE_ADMIN" → "ADMIN"
}

export const isAdmin        = () => getRole() === "ADMIN"
export const isDoctor       = () => getRole() === "DOCTOR"
export const isReceptionist = () => getRole() === "RECEPTIONIST"