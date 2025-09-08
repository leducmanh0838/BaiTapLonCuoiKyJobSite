import { useEffect, useState } from "react";
import { getDistrictOptionsByCity, provinceOptions } from "../../../constants/Provinces";
import { useSearchParams } from "react-router-dom";

const DistrictDropdown = ({ cityCode, selectedCode, setSelectedCode }) => {
    const [districts, setDistricts] = useState([])

    useEffect(() => {
        setDistricts(getDistrictOptionsByCity(parseInt(cityCode)));
    }, [cityCode]);

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
                Chọn quận/huyện:
            </label>
            <select
                id="provinceSelect"
                className="form-select"
                value={selectedCode}
                onChange={handleChange}
            >
                <option value="">--Chọn--</option>
                {districts && districts.length > 0 && districts.map((district) => (
                    <option key={district.code} value={district.code}>
                        {district.name}
                    </option>
                ))}
            </select>

        </div>
    );
};

export default DistrictDropdown;
