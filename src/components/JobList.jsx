import React, { useState, useEffect, useRef } from 'react';
import { gsap } from "gsap";
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

  const init = async () => {
    await sendDepartmentList();
    await sendLocationList();
    await sendJobList();

  }

  useEffect(() => {
    const map = {};
    subscribeLocationList.forEach((item) => {
      map[item.id] = item.name;
    });
    setSubscribeLocationMap(map);
  }, [subscribeLocationList]);

  useEffect(() => {
    let list = subscribeJobList;
    if (subscribeTargetEmploymentType.id) {
      list = list.filter(item => item.employmentType === subscribeTargetEmploymentType.id);
    }
    if (subscribeTargetLocation.id) {
      list = list.filter(item => item.locationId === subscribeTargetLocation.id);
    }
    if (subscribeTargetDepartment.id) {
      list = list.filter(item => item.departmentId === subscribeTargetDepartment.id);
    }
    setSubscribeSearchList(list)
  }, [subscribeTargetEmploymentType, subscribeTargetLocation, subscribeTargetDepartment]);
  useEffect(() => {
    const map = [];
    subscribeJobList.forEach((item) => {
      if (!map.find(val => val.id === item.employmentType)) {
        map.push({
          id: item.employmentType,
          name: item.employmentType
        });
      }
    });
    setSubscribeEmploymentType(map);
    setSubscribeSearchList(subscribeJobList)
  }, [subscribeJobList]);

  const content = useRef(null);
  const contentWrap = useRef(null);

  useEffect(() => {
    const map = {};
    subscribeDepartmentList.forEach((item) => {
      map[item.id] = item.name;
    });
    setSubscribeDepartmentMap(map);
  }, [subscribeDepartmentList]);
  useEffect(() => {
    init();
    const draggable = content.current;
    const el = contentWrap.current;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    draggable.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      currentX = draggable.offsetLeft;
    });

    el.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      let newX = currentX + deltaX;
      if (-newX >= draggable.clientWidth - el.clientWidth) {
        newX = -(draggable.clientWidth - el.clientWidth);
      }
      if (newX > 0) {
        newX = 0
      }
      // 使用GSAP来平滑地移动元素
      gsap.to(draggable, {
        duration: 0.1,
        marginLeft: newX,
        ease: 'power1.out'
      });

      // 更新起始位置以计算接下来的移动距离
      // startX = newX;
    });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });
  }, []);
  const select1 = useRef(null);
  const select2 = useRef(null);
  const select3 = useRef(null);

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
    setSubscribeTargetEmploymentType({});
    setSubscribeTargetLocation({});
    setSubscribeTargetDepartment({});
  }
  return (
    <div className="w-full" ref={contentWrap}>
      <div className="mt-40 mb-[3.75rem] mobile:mb-7 text-h3 tablet:text-h4 mobile:text-h5 font-[Manrope]">
        <span className="mr-4">Open Positions</span>
        <span className="text-light-300">{subscribeSearchList.length}</span>
      </div>
      <div className="h-11 mb-[3.75rem] tablet:mb-11 mobile:mb-7 flex gap-x-5 tablet:gap-x-3 min-w-max w-full" ref={content}>
        <div ref={select1} className="border flex-1 px-4 text-sm mobile:text-xs py-2.5 cursor-pointer relative rounded-xl group border-light-100 flex items-center justify-between">
          {subscribeTargetDepartment.id ? <span className="whitespace-nowrap truncate">{subscribeTargetDepartment.name}</span> : <span className="text-light-200 whitespace-nowrap truncate">Department</span>}<img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" />
          <div className="absolute w-full left-[-1px] top-11 h-1"></div>
          <div onClick={blur} className="absolute left-[-1px] top-12 bg-dark-400 border group-hover:block min-w-full min-h-11 hidden -mt-0.5 border-light-100 rounded-xl overflow-hidden">
            {
              subscribeDepartmentList.map(item => (
                <div key={item.id} onClick={() => { setSubscribeTargetDepartment(item) }} style={item.id === subscribeTargetDepartment.id ? { display: 'none' } : { display: 'block' }} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400 whitespace-nowrap truncate">{item.name}</div>
              ))
            }
          </div>
        </div>
        <div ref={select2} className="border flex-1 px-4 text-sm mobile:text-xs py-2.5 cursor-pointer relative rounded-xl group border-light-100 flex items-center justify-between">
          {subscribeTargetLocation.id ? <span className="whitespace-nowrap truncate">{subscribeTargetLocation.name}</span> : <span className="text-light-200 whitespace-nowrap truncate">Location</span>}<img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" />
          <div className="absolute w-full left-[-1px] top-11 h-1"></div>
          <div onClick={blur} className="absolute left-[-1px] top-12 bg-dark-400 border group-hover:block min-w-full min-h-11 hidden -mt-0.5 border-light-100 rounded-xl overflow-hidden">
            {
              subscribeLocationList.map(item => (
                <div key={item.id} onClick={() => { setSubscribeTargetLocation(item) }} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400 whitespace-nowrap truncate" style={item.id === subscribeTargetLocation.id ? { display: 'none' } : { display: 'block' }}>{item.name}</div>
              ))
            }
          </div>
        </div>
        <div ref={select3} className="border flex-1 px-4 text-sm mobile:text-xs py-2.5 cursor-pointer relative rounded-xl group border-light-100 flex items-center justify-between">
          {subscribeTargetEmploymentType.id ? <span className="whitespace-nowrap truncate">{subscribeTargetEmploymentType.name}</span> : <span className="text-light-200 whitespace-nowrap truncate">Employment Type</span>} <img
            id="icon"
            className="w-5 h-5 rotate-180 group-hover:rotate-0" src={arrowCorner_768_375.src} alt="" /><div className="absolute w-full left-[-1px] top-11 h-1"></div>
          <div onClick={blur} className="absolute left-[-1px] top-12 bg-dark-400 border group-hover:block min-w-full min-h-11 hidden -mt-0.5 border-light-100 rounded-xl overflow-hidden">
            {
              subscribeEmploymentType.map(item => (
                <div key={item.id} onClick={() => { setSubscribeTargetEmploymentType(item) }} className="px-4 py-2.5 hover:bg-light-100 hover:text-dark-400 whitespace-nowrap truncate" style={item.id === subscribeTargetEmploymentType.id ? { display: 'none' } : { display: 'block' }}>{item.name}</div>
              ))
            }
          </div>
        </div>
        <div onClick={resetSearch} className="font-[IBMPlexMono-Medium] flex px-4 py-2.5 cursor-pointer text-sm">
          Reset<img className="w-5 h-5 ml-1" src={reset.src} alt="" />
        </div>
      </div>
      {subscribeTargetDepartment.name && (<div className="text-light-200 text-sm mobile:text-xs mb-5 tablet:mb-4 mobile:mb-3">{subscribeTargetDepartment.name}</div>)}
      <div className="grid gap-7 tablet:gap-4 mobile:gap-3 grid-cols-2 tablet:grid-cols-1 text-sm mobile:text-xs">
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
