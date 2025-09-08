import { useEffect, useState } from "react";
import { getDistrictOptionsByCity, getWardOptionsByDistrict, provinceOptions } from "../../../constants/Provinces";
import { useSearchParams } from "react-router-dom";

const WardDropdown = ({ districtCode, selectedCode, setSelectedCode }) => {
    const [wards, setWards] = useState([])

    useEffect(() => {
        setWards(getWardOptionsByDistrict(parseInt(districtCode)));
        console.info("parseInt(districtCode): ", parseInt(districtCode))
        console.info("getWardOptionsByDistrict(parseInt(districtCode)): ", JSON.stringify(getWardOptionsByDistrict(parseInt(districtCode))))
    }, [districtCode]);


    const handleChange = (event) => {
        const code = event.target.value;
        setSelectedCode(code);

        // if (code) {
        //     searchParams.set("city_code", code);
        //     setSearchParams(searchParams); // cập nhật param trên URL
        // } else {
        //     searchParams.delete("city_code");
        //     setSearchParams(searchParams);
        // }
    };

    return (
        <div className="d-flex container align-items-center gap-2">
            <label htmlFor="provinceSelect" className="form-label d-inline text-nowrap fw-bold">
                Chọn phường/xã:
            </label>
            <select
                id="provinceSelect"
                className="form-select"
                value={selectedCode}
                onChange={handleChange}
            >
                <option value="">--Chọn--</option>
                {wards && wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                        {ward.name}
                    </option>
                ))}
            </select>

        </div>
    );
};

export default WardDropdown;
