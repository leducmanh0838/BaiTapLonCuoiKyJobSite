import provinces from './provinces.json';


export const provinceOptions = provinces.map(item => ({
  name: item.name,
  code: item.code
}));