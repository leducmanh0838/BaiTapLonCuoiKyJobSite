import { useEffect, useState } from "react";
import { provinceOptions } from "../../../constants/Provinces";
import { useSearchParams } from "react-router-dom";
import ProvinceDropdown from "./ProvinceDropdown";

const ProvinceFilterDropdown = () => {
    const [selectedCode, setSelectedCode] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (selectedCode) {
            searchParams.set("city_code", selectedCode);
            setSearchParams(searchParams); // cập nhật param trên URL
        } else {
            searchParams.delete("city_code");
            setSearchParams(searchParams);
        }
    }, [selectedCode])

    // const handleChange = (event) => {
    //     const code = event.target.value;
    //     setSelectedCode(code);

    //     if (code) {
    //         searchParams.set("city_code", code);
    //         setSearchParams(searchParams); // cập nhật param trên URL
    //     } else {
    //         searchParams.delete("city_code");
    //         setSearchParams(searchParams);
    //     }
    // };

    return (
        <ProvinceDropdown {...{ selectedCode, setSelectedCode }} />
    );
};

export default ProvinceFilterDropdown;
