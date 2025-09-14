// class ApplicationStatus(models.TextChoices):
//     PENDING = 'PENDING', 'Đang chờ'
//     INTERVIEW = 'INTERVIEW', 'Phỏng vấn'
//     HIRED = 'HIRED', 'Trúng tuyển'
//     REJECTED = 'REJECTED', 'Từ chối'

export const ApplicationStatus = Object.freeze({
  PENDING: { value: "PENDING", label: "Đang chờ", color: "#facc15"},
  INTERVIEW: { value: "INTERVIEW", label: "Phỏng vấn", color: "#3b82f6"},
  HIRED: { value: "HIRED", label: "Trúng tuyển", color: "#16a34a"},
  REJECTED: { value: "REJECTED", label: "Từ chối", color: "#ef4444"},
});

export const ApplicationStatusList = Object.values(ApplicationStatus);

export function getApplicationStatusByValue(value) {
  return Object.values(ApplicationStatus).find(role => role.value === value);
}