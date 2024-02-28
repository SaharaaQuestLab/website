import React, { useState, useEffect, useRef } from 'react';
import reset from "@/assets/icons/reset.png";
import arrowCorner_768_375 from "@/assets/icons/arrowCorner_768_375.svg";
import arrowRightUp from "@/assets/icons/arrowRightUp-white.svg";

export default function JobList() {
  const [orgPositionList, setOrgPositionList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [employmentTypeList, setEmploymentTypeList] = useState([]);

  const [selectDepartment, setSelectDepartment] = useState({});
  const [selectLocation, setSelectLocation] = useState({});
  const [selectEmploymentType, setSelectEmploymentType] = useState({});

  const select1 = useRef(null);
  const select2 = useRef(null);
  const select3 = useRef(null);

  const sendDepartmentList = async () => {
    const apiResult = await fetch('https://job-api.saharaa.info/department.list', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    })
    if (apiResult.status == 200) {
      const data = await apiResult.json();
      setDepartmentList(data.results);
    }
  }

  const sendJobList = async () => {
    const apiResult = await fetch('https://job-api.saharaa.info/job.list', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    })
    if (apiResult.status == 200) {
      const data = await apiResult.json();
      const positions = data.results || [];
      const employTypes = Array.from(new Set(positions.map(p => p.employmentType))).map(type => ({ id: type, name: type }));
      // setPositionList([...positions]);
      setOrgPositionList([...positions]);
      setEmploymentTypeList(employTypes);
    }
  }
  const sendLocationList = async () => {
    const apiResult = await fetch('https://job-api.saharaa.info/location.list', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    })
    if (apiResult.status == 200) {
      const data = await apiResult.json();
      setLocationList(data.results);
    }
  }

  const getLocationName = (id) => locationList.find(item => item.id === id)?.name || "";
  const getDepartmentName = (id) => departmentList.find(item => item.id === id)?.name || "";

  const init = async () => {
    Promise.all([sendJobList(), sendDepartmentList()], sendLocationList())
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    let list = [...orgPositionList];
    if (selectEmploymentType.id) {
      list = list.filter(item => item.employmentType === selectEmploymentType.id);
    }
    if (selectLocation.id) {
      list = list.filter(item => item.locationId === selectLocation.id);
    }
    if (selectDepartment.id) {
      list = list.filter(item => item.departmentId === selectDepartment.id);
    }
    setPositionList(list)
  }, [selectEmploymentType, selectLocation, selectDepartment, orgPositionList]);



  const blur = () => {
    select1.current.style.overflow = "hidden";
    select2.current.style.overflow = "hidden";
    select3.current.style.overflow = "hidden";
    setTimeout(() => {
      select1.current.style.overflow = "visible";
      select2.current.style.overflow = "visible";
      select3.current.style.overflow = "visible";
    }, 20);
  }
  const resetSearch = () => {
    setSelectEmploymentType({});
    setSelectLocation({});
    setSelectDepartment({});
  }
  return (
    <div className="w-full">
      <div className="mt-40 mb-[3.75rem] mobile:mb-7 text-h3 tablet:text-h4 mobile:text-h5 font-[Manrope]">
        <span className="mr-4">Open Positions</span>
        <span className="text-light-300">{positionList.length}</span>
      </div>
      <div className="min-h-11 mb-[3.75rem] tablet:mb-11 mobile:mb-7 flex gap-x-5 tablet:gap-x-3 gap-y-7 whitespace-pre-wrap max-w-full flex-wrap">
        <div ref={select1} className="border flex-1 mobile:min-w-[43%] px-4 text-sm mobile:text-xs py-2.5 cursor-pointer relative rounded-xl group border-light-100 flex items-center justify-between">
          {selectDepartment.id ? <span className="whitespace-nowrap truncate">{selectDepartment.name}</span> : <span className="text-light-200 whitespace-nowrap truncate">Department</span>}<img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" />
          <div className="absolute w-full left-[-1px] top-11 h-1"></div>
          <div onClick={blur} className="absolute left-[-1px] top-12 bg-dark-400 border group-hover:block min-w-full min-h-11 hidden -mt-0.5 border-light-100 rounded-xl overflow-hidden">
            {
              departmentList.map(item => (
                <div key={item.id} onClick={() => { setSelectDepartment(item) }} style={item.id === selectDepartment.id ? { display: 'none' } : { display: 'block' }} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400 whitespace-nowrap truncate">{item.name}</div>
              ))
            }
          </div>
        </div>
        <div ref={select2} className="border flex-1 mobile:min-w-[43%] px-4 text-sm mobile:text-xs py-2.5 cursor-pointer relative rounded-xl group border-light-100 flex items-center justify-between">
          {selectLocation.id ? <span className="whitespace-nowrap truncate">{selectLocation.name}</span> : <span className="text-light-200 whitespace-nowrap truncate">Location</span>}<img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" />
          <div className="absolute w-full left-[-1px] top-11 h-1"></div>
          <div onClick={blur} className="absolute left-[-1px] top-12 bg-dark-400 border group-hover:block min-w-full min-h-11 hidden -mt-0.5 border-light-100 rounded-xl overflow-hidden">
            {
              locationList.map(item => (
                <div key={item.id} onClick={() => { setSelectLocation(item) }} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400 whitespace-nowrap truncate" style={item.id === selectLocation.id ? { display: 'none' } : { display: 'block' }}>{item.name}</div>
              ))
            }
          </div>
        </div>
        <div ref={select3} className="border flex-1 px-4 text-sm mobile:text-xs py-2.5 cursor-pointer relative rounded-xl group border-light-100 flex items-center justify-between">
          {selectEmploymentType.id ? <span className="whitespace-nowrap truncate">{selectEmploymentType.name}</span> : <span className="text-light-200 whitespace-nowrap truncate">Employment Type</span>} <img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" /><div className="absolute w-full left-[-1px] top-11 h-1"></div>
          <div onClick={blur} className="absolute left-[-1px] top-12 bg-dark-400 border group-hover:block min-w-full min-h-11 hidden -mt-0.5 border-light-100 rounded-xl overflow-hidden">
            {
              employmentTypeList.map(item => (
                <div key={item.id} onClick={() => { setSelectEmploymentType(item) }} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400 whitespace-nowrap truncate" style={item.id === selectEmploymentType.id ? { display: 'none' } : { display: 'block' }}>{item.name}</div>
              ))
            }
          </div>
        </div>
        <div onClick={resetSearch} className="font-[IBMPlexMono-Medium] flex px-4 py-2.5 cursor-pointer text-sm">
          Reset<img className="w-5 h-5 ml-1" src={reset.src} alt="" />
        </div>
      </div>
      {selectDepartment.name && (<div className="text-light-200 text-sm mobile:text-xs mb-5 tablet:mb-4 mobile:mb-3">{selectDepartment.name}</div>)}
      <div className="grid gap-7 tablet:gap-4 mobile:gap-3 grid-cols-2 tablet:grid-cols-1 text-sm mobile:text-xs">
        {
          positionList.map(item => (
            <a key={item.id} href={`https://jobs.ashbyhq.com/Sahara/${item.jobPostingIds[0]}`} className="border border-dark-200 rounded-xl px-4 py-3 flex justify-between items-center">
              <div>
                <div className="mb-0.5">{item.title}</div>
                <div>{getDepartmentName(item.departmentId)}.{getLocationName(item.locationId)}.{item.employmentType}</div>
              </div>
              <img className="w-5 h-5" src={arrowRightUp.src} alt="" />
              {/* <svg> usr</svg> */}
            </a>
          ))
        }
      </div>
    </div>
  );
}
