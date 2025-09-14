import { useState } from "react";
import { provinceOptions } from "../../../constants/Provinces";
import { useSearchParams } from "react-router-dom";

const ProvinceDropdown = ({selectedCode, setSelectedCode}) => {
    // const [selectedCode, setSelectedCode] = useState(null);
    // const [searchParams, setSearchParams] = useSearchParams();

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
            <label htmlFor="provinceSelect" className="form-label d-inline text-nowrap">
                Chọn tỉnh:
            </label>
            <select
                id="provinceSelect"
                className="form-select"
                value={selectedCode}
                onChange={handleChange}
            >
                <option value="">--Chọn--</option>
                {provinceOptions.map((province) => (
                    <option key={province.code} value={province.code}>
                        {province.name}
                    </option>
                ))}
            </select>

            {/* {selectedCode && (
        <div className="alert alert-info mt-3">
          Bạn đã chọn mã tỉnh: <strong>{selectedCode}</strong>
        </div>
      )} */}
        </div>
    );
};

export default ProvinceDropdown;
