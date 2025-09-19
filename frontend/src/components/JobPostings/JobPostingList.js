import { useEffect, useState } from "react";
import SearchBox from "../layout/SearchBox";
import Pagination from "../layout/Pagination";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ProvinceFilterDropdown from "../layout/provinces/ProvinceFilterDropdown";
import DistrictFilterDropdown from "../layout/provinces/DistrictFilterDropdown";
import TagFilterButton from "../layout/tags/TagFilterButton";
import Apis, { endpoints } from "../../configs/Apis";
import { FaRegBuilding, FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlinePlace } from "react-icons/md";
import { getDistrictNameByCode, getProvinceNameByCode } from "../../constants/Provinces";
// import { format } from "date-fns";
import GridTagList from "../layout/tags/GridTagList";
import { BriefcaseFill, CashStack, GeoAltFill } from "react-bootstrap-icons";

const ItemList = ({ items }) => {
    const nav = useNavigate();
    return (<>

        <div className="container">
            <div className="row">
                {items && items.map((item, index) => (
                    <div className="col-12 col-md-6">
                        <div className="container p-0 m-2 btn btn-light text-start" onClick={() => nav(`/job-postings/${item.id}`)}>
                            <div className="row">
                                <div className="col-4">
                                    <img
                                        src={item.image}
                                        alt="random"
                                        className="rounded-start w-100"
                                        style={{ objectFit: "cover", height: "200px" }}
                                    />
                                </div>
                                <div className="col-8 p-3">
                                    <h5>{item.title}</h5>
                                    {/* FaRegClock    */}
                                    {/* <div>
                                        <span> <FaRegBuilding className="me-2" /> {item.company_name}</span>
                                    </div>
                                    <div>
                                        <span> <FaRegMoneyBillAlt className="me-2" /> {item.salary}</span>
                                    </div>
                                    <div>
                                        <span> <MdOutlinePlace className="me-2" /> {item.district_code && `${getDistrictNameByCode(item.district_code)}, `} {item.city_code && getProvinceNameByCode(item.city_code)}</span>
                                    </div>
                                    <div>
                                        <GridTagList tags={item.tags} link={false} />
                                    </div> */}
                                    <div className="d-flex align-items-center text-muted mb-2">
                                        <FaRegBuilding className="me-2" />
                                        Công ty: <b className="ms-1 text-dark">{item.company_name}</b>
                                    </div>
                                    <div className="d-flex align-items-center text-muted mb-2">
                                        <CashStack className="me-2" />
                                        Lương: <b className="ms-1 text-dark">{item.salary ? `${item.salary.toLocaleString()} VNĐ` : "Thỏa thuận"}</b>
                                    </div>
                                    <div className="d-flex align-items-center text-muted mb-2">
                                        <BriefcaseFill className="me-2" />
                                        Kinh nghiệm: <b className="ms-1 text-dark">{item.experience || "Không yêu cầu"}</b>
                                    </div>
                                    <div className="d-flex align-items-center text-muted">
                                        <GeoAltFill className="me-2" />
                                        <b className="ms-1 text-dark">{item.district_code && `${getDistrictNameByCode(item.district_code)}, `} {item.city_code && getProvinceNameByCode(item.city_code)}</b>
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
                <div className="col-12 col-md-4 mb-2">
                    <SearchBox />
                </div>
                <div className="col-12 col-md-4 mb-2">
                    <ProvinceFilterDropdown />
                </div>
                <div className="col-12 col-md-4 mb-2">
                    <DistrictFilterDropdown />
                </div>
            </div>
            <div className="row p-2">
                <TagFilterButton />
            </div>

            {jobs && jobs.length > 0 ? <ItemList items={jobs} /> : <div className="container">
                <h3 className="text-muted">Không tìm thấy công việc nào</h3>
            </div>}

            {jobs && jobs.length > 0 && totalPage &&
                <div className="row justify-content-center mt-2">
                    <Pagination totalPages={totalPage} />
                </div>}
        </div>
    </>)
}

export default JobPostingList;