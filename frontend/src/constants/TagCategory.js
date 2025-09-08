export const TagCategory = Object.freeze({
  SKILL: { value: "SKILL", label: "Kỹ năng"},
  FIELD: { value: "FIELD", label: "Lĩnh vực"},
  JOB_TYPE: { value: "JOB_TYPE", label: "Hình thức làm việc"},
  LEVEL: { value: "LEVEL", label: "Cấp bậc"},
  LANGUAGE: { value: "LANGUAGE", label: "Ngôn ngữ"},
  BENEFIT: { value: "BENEFIT", label: "Phúc lợi"},
});

export const TagCategoryList = Object.values(TagCategory);

export function getTagCategoryByValue(value) {
  return Object.values(TagCategory).find(role => role.value === value);
}