import { useEffect, useState } from "react";
import ProvinceDropdown from "../layout/ProvinceDropdown";
import SearchBox from "../layout/SearchBox";
import Pagination from "../layout/Pagination";
import { useSearchParams } from "react-router-dom";

const ItemList = ({ items }) => {
    return (<>

        <div className="container">
            <div className="row">
                {items && items.map((item, index) => (
                    <div className="col-6">
                        <div className="container p-3">
                            <div className="row">
                                <div className="col-6">
                                    <img
                                        src={item.image}
                                        alt="random"
                                        className="img-fluid w-100"
                                        style={{ objectFit: "cover", height: "200px" }}
                                    />
                                </div>
                                <div className="col-6">
                                    <h5>{item.title}</h5>
                                    <div>{item.field1}</div>
                                    <div>{item.field2}</div>
                                    <div>{item.field3}</div>
                                    <div className="d-flex my-2 gap-1">
                                        <button className="btn btn-success">Chỉnh sửa</button>
                                        <button className="btn btn-danger">xóa</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    </>)
}

const Sample1 = ({ }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const items = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Tiêu đề ${i + 1}`,
        image: `https://picsum.photos/200/300?random=${i + 1}`,
        field1: `Trường 1`,
        field2: `Trường 2`,
        field3: `Trường 3`
    }));

    useEffect(() => {
        const city_code = searchParams.get("city_code") || "";
        const keyword = searchParams.get("keyword") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        console.info("city_code: ", city_code)
        console.info("keyword: ", keyword)
        console.info("page: ", page)
        try {
            // fetch data
        } catch (err) {

        }
    }, [searchParams.toString()]);

    return (<>
        <div className="container">

            <div className="row p-2">
                <div className="col-6">
                    <SearchBox />
                </div>
                <div className="col-6">
                    <ProvinceDropdown />
                </div>
            </div>
            <div className="row justify-content-center">
                <Pagination totalPages={10} />
            </div>
        </div>
        <ItemList items={items} />
    </>)
}

export default Sample1;