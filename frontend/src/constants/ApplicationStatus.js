// class ApplicationStatus(models.TextChoices):
//     PENDING = 'PENDING', 'Đang chờ'
//     INTERVIEW = 'INTERVIEW', 'Phỏng vấn'
//     HIRED = 'HIRED', 'Trúng tuyển'
//     REJECTED = 'REJECTED', 'Từ chối'

export const ApplicationStatus = Object.freeze({
  PENDING: { value: "PENDING", label: "Đang chờ"},
  INTERVIEW: { value: "INTERVIEW", label: "Phỏng vấn"},
  HIRED: { value: "HIRED", label: "Trúng tuyển"},
  REJECTED: { value: "REJECTED", label: "Từ chối"},
});

export const ApplicationStatusList = Object.values(ApplicationStatus);

export function getApplicationStatusByValue(value) {
  return Object.values(ApplicationStatus).find(role => role.value === value);
}