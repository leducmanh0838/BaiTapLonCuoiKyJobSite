import { useEffect, useState } from "react";
import SearchBox from "../layout/SearchBox";
import Pagination from "../layout/Pagination";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ProvinceFilterDropdown from "../layout/provinces/ProvinceFilterDropdown";
import DistrictFilterDropdown from "../layout/provinces/DistrictFilterDropdown";
import TagFilterButton from "../layout/tags/TagFilterButton";
import Apis, { endpoints } from "../../configs/Apis";
import { FaMoneyBill, FaRegBuilding, FaRegClock, FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlinePlace, MdWorkOutline } from "react-icons/md";
import { getDistrictNameByCode, getProvinceNameByCode } from "../../constants/Provinces";
import { format } from "date-fns";
import GridTagList from "../layout/tags/GridTagList";

const ItemList = ({ items }) => {
    const nav = useNavigate();
    return (<>

        <div className="container">
            <div className="row">
                {items && items.map((item, index) => (
                    <div className="col-6">
                        <div className="container p-3 btn btn-light text-start" onClick={()=>nav(`/job-postings/${item.id}`)}>
                            <div className="row">
                                <div className="col-6">
                                    <img
                                        src={item.image}
                                        alt="random"
                                        className="img-fluid w-100"
                                        style={{ objectFit: "cover", height: "300px" }}
                                    />
                                </div>
                                <div className="col-6">
                                    <h5>{item.title}</h5>
                                    {/* FaRegClock    */}
                                    <div>
                                        <span> <FaRegBuilding className="me-2" /> {item.company_name}</span>
                                    </div>
                                    <div>
                                        <span> <FaRegMoneyBillAlt className="me-2" /> {item.salary}</span>
                                    </div>
                                    {/* <div>
                                        <span> <MdWorkOutline className="me-2" /> {item.experience}</span>
                                    </div> */}
                                    <div>
                                        <span> <MdOutlinePlace className="me-2" /> {item.district_code && `${getDistrictNameByCode(item.district_code)}, `} {item.city_code && getProvinceNameByCode(item.city_code)}</span>
                                    </div>
                                    {/* <div>
                                        <span> <FaRegClock className="me-2" /> {format(new Date(item.deadline), "dd-MM-yyyy")}</span>
                                    </div> */}
                                    <div>
                                        <GridTagList tags={item.tags} link={false} />
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

const JobPostingList = ({ }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [jobs, setJobs] = useState([]);
    const [totalPage, setTotalPage] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await Apis(`${endpoints.jobPostings.list}${location.search}`);
                // console.info("res.data: ", res.data.results)
                console.info("location.search: ", location.search)
                setJobs(res.data.results)
                setTotalPage(res.data.count / (10) + 1)
            } catch (err) {

            }
        }

        fetchData();
    }, [location.search]);

    return (<>
        <div className="container">

            <div className="row p-2">
                <div className="col-4">
                    <SearchBox />
                </div>
                <div className="col-4">
                    <ProvinceFilterDropdown />
                </div>
                <div className="col-4">
                    <DistrictFilterDropdown />
                </div>
            </div>
            <div className="row p-2">
                <TagFilterButton />
            </div>
            {jobs && jobs.length > 0 && totalPage &&
                <div className="row justify-content-center">
                    <Pagination totalPages={totalPage} />
                </div>}

        </div>
        {jobs && jobs.length > 0 ? <ItemList items={jobs} /> : <div className="container">
            <h3 className="text-muted">Không tìm thấy công việc nào</h3>
        </div>}

    </>)
}

export default JobPostingList;


// const JobPostingList = () => {
//     return (<>
//     Danh sách các tin tuyển dụng hiển thị ở đây
//     </>)
// };

// export default JobPostingList;