import provinces from './provinces.json';


export const provinceOptions = provinces.map(item => ({
  name: item.name,
  code: item.code
}));

export const getProvinceNameByCode = (code) => {
  const province = provinceOptions.find(item => item.code === code);
  return province ? province.name : null;
};

export const getDistrictOptionsByCity = (cityCode) => {
  const province = provinces.find(item => item.code === cityCode);
  if (!province) return [];

  return province.districts
    .filter(district => district.division_type === "huyện" || district.division_type === "quận")
    .map(district => ({
      name: district.name,
      code: district.code
    }));
};

export const getDistrictNameByCode = (districtCode) => {
  for (const province of provinces) {
    const district = province.districts.find(d => d.code === districtCode);
    if (district) {
      return district.name;
    }
  }
  return null;
};

export const getWardOptionsByDistrict = (districtCode) => {
  let i = 0;
  for (const province of provinces) {
    const district = province.districts.find(d => d.code === districtCode);
    if (district && district.wards) {
      return district.wards.map(ward => ({
        name: ward.name,
        code: ward.code
      }));
    }
  }
  return [];
};

export const getWardNameByCode = (wardCode) => {
  for (const province of provinces) {
    for (const district of province.districts) {
      const ward = district.wards.find(w => w.code === wardCode);
      if (ward) return ward.name;
    }
  }
  return null;
};