import provinces from './provinces.json';


export const provinceOptions = provinces.map(item => ({
  name: item.name,
  code: item.code
}));

export const getProvinceNameByCode = (code) => {
  const province = provinceOptions.find(item => item.code === code);
  return province ? province.name : null;
};