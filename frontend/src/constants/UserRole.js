export const UserRole = Object.freeze({
  CANDIDATE: { value: "CANDIDATE", label: "Ứng viên"},
  EMPLOYER: { value: "EMPLOYER", label: "Nhà tuyển dụng"},
});

export const UserRoleList = Object.values(UserRole);
/*
[
  { "value": "CANDIDATE", "label": "Ứng viên" },
  { "value": "EMPLOYER", "label": "Nhà tuyển dụng" }
]
 */

export function getUserRoleByValue(value) {
  return Object.values(UserRole).find(role => role.value === value);
}

/*

getUserRoleByValue("CANDIDATE") => { "value": "CANDIDATE", "label": "Ứng viên" }

 */