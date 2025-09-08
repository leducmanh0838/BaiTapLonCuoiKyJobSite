import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DistrictDropdown from "./DistrictDropdown";

const DistrictFilterDropdown = () => {
    const [selectedCode, setSelectedCode] = useState(null);
    const [cityCode, setCityCode] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (selectedCode) {
            searchParams.set("district_code", selectedCode);
            setSearchParams(searchParams); // cập nhật param trên URL
        } else {
            searchParams.delete("district_code");
            setSearchParams(searchParams);
        }
    }, [selectedCode])


    useEffect(() => {
        const cityCodeParam = parseInt(searchParams.get("city_code"));
        console.info("cityCodeParam: ", cityCodeParam)
        if (cityCodeParam) {
            setCityCode(cityCodeParam);
        }
    }, [searchParams]);

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
        <DistrictDropdown {...{ cityCode, selectedCode, setSelectedCode }} />
    );
};

export default DistrictFilterDropdown;
