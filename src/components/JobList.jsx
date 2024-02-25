import React, { useState, useEffect } from 'react';
import reset from "@/assets/icons/reset.png";
import arrowCorner_768_375 from "@/assets/icons/arrowCorner_768_375.svg";
import arrowRightUp from "@/assets/icons/arrowRightUp-white.svg";

export default function JobList() {
  const [subscribeLocationList, setSubscribeLocationList] = useState([]);
  const [subscribeJobList, setSubscribeJobList] = useState([]);
  const [subscribeDepartmentList, setSubscribeDepartmentList] = useState([]);
  const [subscribeEmploymentType, setSubscribeEmploymentType] = useState([]);
  const [subscribeLocationMap, setSubscribeLocationMap] = useState({});
  const [subscribeDepartmentMap, setSubscribeDepartmentMap] = useState({});
  const [subscribeSearchList, setSubscribeSearchList] = useState([]);
  const [subscribeTargetDepartment, setSubscribeTargetDepartment] = useState({});
  const [subscribeTargetLocation, setSubscribeTargetLocation] = useState({});
  const [subscribeTargetEmploymentType, setSubscribeTargetEmploymentType] = useState({});

  const sendDepartmentList = async () => {
    const apiResult = await fetch('https://job-api.saharaa.info/department.list', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST'
    })
    if (apiResult.status == 200) {
      const data = await apiResult.json();
      setSubscribeDepartmentList(data.results);
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
      setSubscribeJobList(data.results)
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
      setSubscribeLocationList(data.results);

    }
  }
  const searchList = () => {

  }
  const init = async () => {
    await sendDepartmentList();
    await sendLocationList();
    await sendJobList();
    // setSubscribeEmploymentType();
    searchList();
  }

  useEffect(()=>{
    const map = {};
    subscribeLocationList.forEach((item)=>{
      map[item.id] = item.name;
    });
    setSubscribeLocationMap(map);
  },[subscribeLocationList]);

  useEffect(()=>{
    let list = subscribeJobList;
    if(subscribeTargetEmploymentType.id) {
      list = list.filter(item=>item.employmentType === subscribeTargetEmploymentType.id);
    }
    if(subscribeTargetLocation.id) {
      list = list.filter(item=>item.locationId === subscribeTargetLocation.id);
    }
    if(subscribeTargetDepartment.id) {
      list = list.filter(item=>item.departmentId === subscribeTargetDepartment.id);
    }
    setSubscribeSearchList(list)
  },[subscribeTargetEmploymentType, subscribeTargetLocation, subscribeTargetDepartment]);
  useEffect(()=>{
    const map = [];
    subscribeJobList.forEach((item)=>{
      if(!map.find(val=> val.id === item.employmentType)) {
        map.push({
          id: item.employmentType,
          name: item.employmentType
        });
      }
    });
    setSubscribeEmploymentType(map);
    setSubscribeSearchList(subscribeJobList)
  },[subscribeJobList])
  useEffect(()=>{
    const map = {};
    subscribeDepartmentList.forEach((item)=>{
      map[item.id] = item.name;
    });
    setSubscribeDepartmentMap(map);
  },[subscribeDepartmentList]);
  useEffect(()=>{
    init();
  },[]);

  const resetSearch = () => {
    setSubscribeTargetEmploymentType({});
    setSubscribeTargetLocation({});
    setSubscribeTargetDepartment({});
  }
  return (
    <div>
      <div className="mt-40 mb-[3.75rem] text-h3 font-[Manrope]">
        <span className="mr-4">Open Positions</span>
        <span className="text-light-300">{subscribeSearchList.length}</span>
      </div>
      <div className="h-11 mb-[3.75rem] flex gap-x-5">
        <div className="border flex-1 px-4 text-sm py-2.5 cursor-pointer relative rounded-xl group hover:rounded-b-none hover:border-b-[rgba(0,0,0,0)] border-light-100 flex items-center justify-between">
          {subscribeTargetDepartment.id ? <span>{subscribeTargetDepartment.name}</span>:<span className="text-light-200">Department</span>}<img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" />
          <div className="absolute left-[-1px] top-11 w-[calc(100%+2px)] bg-dark-400 border-b border-l border-r group-hover:block hidden -mt-0.5 border-light-100 rounded-xl rounded-t-none">
            {
              subscribeDepartmentList.map(item=>(
                <div key={item.id} onClick={()=> {setSubscribeTargetDepartment(item)}} style={ item.id === subscribeTargetDepartment.id ? {display: 'none'} : { display: 'block'} } className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400">{item.name}</div>
              ))
            }
          </div>
        </div>
        <div className="border flex-1 px-4 text-sm py-2.5 cursor-pointer relative rounded-xl group hover:rounded-b-none hover:border-b-[rgba(0,0,0,0)] border-light-100 flex items-center justify-between">
          {subscribeTargetLocation.id ? <span>{subscribeTargetLocation.name}</span>:<span className="text-light-200">Location</span>}<img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" />
          <div className="absolute left-[-1px] top-11 w-[calc(100%+2px)] bg-dark-400 border-b border-l border-r group-hover:block hidden -mt-0.5 border-light-100 rounded-xl rounded-t-none">
            {
              subscribeLocationList.map(item => (
                <div key={item.id} onClick={()=> {setSubscribeTargetLocation(item)}} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400" style={ item.id === subscribeTargetLocation.id ? {display: 'none'} : { display: 'block'} }>{item.name}</div>
              ))
            }
          </div>
        </div>
        <div className="border flex-1 px-4 text-sm py-2.5 cursor-pointer relative rounded-xl group hover:rounded-b-none hover:border-b-[rgba(0,0,0,0)] border-light-100 flex items-center justify-between">
          {subscribeTargetEmploymentType.id ? <span>{subscribeTargetEmploymentType.name}</span> : <span className="text-light-200">Employment Type</span>} <img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" />
          <div className="absolute left-[-1px] top-11 w-[calc(100%+2px)] bg-dark-400 border-b border-l border-r group-hover:block hidden -mt-0.5 border-light-100 rounded-xl rounded-t-none">
            {
              subscribeEmploymentType.map(item => (
                <div key={item.id} onClick={()=> {setSubscribeTargetEmploymentType(item)}} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400" style={ item.id === subscribeTargetEmploymentType.id ? {display: 'none'} : { display: 'block'} }>{item.name}</div>
              ))
            }
          </div>
        </div>
        <div onClick={resetSearch} className="font-[IBMPlexMono-Medium] flex px-4 py-2.5 cursor-pointer text-sm">
          Reset<img className="w-5 h-5 ml-1" src={reset.src} alt="" />
        </div>
      </div>
      <div className="text-light-200 text-sm mb-5">Engineering</div>
      <div className="grid gap-7 grid-cols-2 tablet:grid-cols-1">
        {
          subscribeSearchList.map(item => (
            <div key={item.id} className="border border-dark-200 rounded-xl px-4 py-3 flex justify-between items-center">
              <div>
                <div className="mb-0.5">{item.title}</div>
                <div>{subscribeDepartmentMap[item.departmentId]}.{subscribeLocationMap[item.locationId]}.{item.employmentType}</div>
              </div>
              <img className="w-5 h-5" src={arrowRightUp.src} alt="" />
              {/* <svg> usr</svg> */}
            </div>
          ))
        }
      </div>
    </div>
  );
}
