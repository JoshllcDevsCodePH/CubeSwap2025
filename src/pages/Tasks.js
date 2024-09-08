import React, { useEffect, useState } from 'react';
import Animate from '../Components/Animate';
import { Outlet } from 'react-router-dom';
import coinsmall from "../images/coinsmall.webp";
import taskbook from "../images/taskbook.webp";
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../Components/Spinner';
import TaskOne from '../Components/TaskOne';
import TaskTwo from '../Components/TaskTwo';
import TaskThree from '../Components/TaskThree';
import ClaimLeveler from '../Components/ClaimLeveler';
import Levels from '../Components/Levels';
import { IoCheckmarkSharp } from "react-icons/io5";
import congrats from "../images/celebrate.gif";
import { useUser } from '../context/userContext';
import MilestoneRewards from '../Components/MilestoneRewards';
import ReferralRewards from '../Components/Rewards';

const Tasks = () => {
    const { id, balance, refBonus, taskCompleted, level, setTaskCompleted, taskCompleted2, setTaskCompleted2, taskCompleted3, setTaskCompleted3 } = useUser();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [claimLevel, setClaimLevel] = useState(false);
    const [showLevels, setShowLevels] = useState(false);
    const [message, setMessage] = useState("");
    const taskID = "task_3100";
    const taskID2 = "task_3200";
    const taskID3 = "task_3300";

    const [activeIndex, setActiveIndex] = useState(1);

    const handleMenu = (index) => {
        setActiveIndex(index);
    };

    const taskOne = () => {
        setShowModal(true);
        document.getElementById("footermain")?.style.setProperty('z-index', '50');
    };

    const taskTwo = () => {
        setShowModal2(true);
        document.getElementById("footermain")?.style.setProperty('z-index', '50');
    };

    const taskThree = () => {
        setShowModal3(true);
        document.getElementById("footermain")?.style.setProperty('z-index', '50');
    };

    useEffect(() => {
        const fetchTaskCompletion = async () => {
            try {
                const task1Completed = await checkTaskCompletion(id, taskID);
                setTaskCompleted(task1Completed);

                const task2Completed = await checkTaskCompletion(id, taskID2);
                setTaskCompleted2(task2Completed);

                const task3Completed = await checkTaskCompletion(id, taskID3);
                setTaskCompleted3(task3Completed);

                console.log('my userid is:', id);
            } catch (error) {
                console.error('Error fetching task completion: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskCompletion();
    }, [id, taskID, taskID2, taskID3, setTaskCompleted, setTaskCompleted2, setTaskCompleted3]);

    const checkTaskCompletion = async (id, taskId) => {
        try {
            const userTaskDocRef = doc(db, 'userTasks', `${id}_${taskId}`);
            const docSnap = await getDoc(userTaskDocRef);
            if (docSnap.exists()) {
                return docSnap.data().completed;
            } else {
                return false;
            }
        } catch (e) {
            console.error('Error checking task completion: ', e);
            return false;
        }
    };

    const levelsAction = () => {
        setShowLevels(true);
        document.getElementById("footermain")?.style.setProperty('z-index', '50');
    };

    const formatNumber = (num) => {
        if (num < 1000000) {
            return new Intl.NumberFormat().format(num);
        } else {
            return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short'
            }).format(num);
        }
    };
    
    

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <Animate>
                    <div className='w-full justify-center flex-col space-y-3 px-5'>
                        <div className='fixed top-0 left-0 right-0 pt-8 px-5'>
                            <div className="flex space-x-2 justify-center items-center relative">
                                <div id="congrat" className='opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all'>
                                    <img src={congrats} alt="congrats" className="w-full" />
                                </div>
                                <div className="w-[50px] h-[50px]">
                                    <img src={coinsmall} className="w-full" alt="coin" />
                                </div>
                                <h1 className="text-[#fff] text-[42px] font-extrabold">
                                    {formatNumber(balance + refBonus)}
                                </h1>
                            </div>

                            <div onClick={levelsAction} className="w-full flex ml-[6px] space-x-1 items-center justify-center">
                                <img src={level.imgUrl} className="w-[25px] relative" alt="level" />
                                <h2 className="text-[#9d99a9] text-[20px] font-medium">{level.name}</h2>
                                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
                            </div>

                            <div className='bg-borders w-full px-5 h-[1px] !mt-5 !mb-5'></div>

                            <div className='w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center'>
                                <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-cards' : ''} rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                                    Special
                                </div>
                                <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-cards' : ''} rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                                    Leagues
                                </div>
                                <div onClick={() => handleMenu(3)} className={`${activeIndex === 3 ? 'bg-cards' : ''} rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}>
                                    Ref Tasks
                                </div>
                            </div>
                        </div>

                        <div className='!mt-[204px] w-full h-[60vh] flex flex-col'>
                            <div className={`${activeIndex === 1 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>
                                <div onClick={taskOne} className='bg-cards rounded-[10px] p-[14px] flex justify-between items-center'>
                                    <div className='flex flex-1 items-center space-x-2'>
                                        <div>
                                            <img src={taskbook} alt="tasks" className='w-[50px]' />
                                        </div>
                                        <div className='flex flex-col space-y-1'>
                                            <span className='font-semibold'>Subscribe youtube channel</span>
                                            <div className='flex items-center space-x-1'>
                                                <span className="w-[20px] h-[20px]">
                                                    <img src={coinsmall} className="w-full" alt="coin" />
                                                </span>
                                                <span className='font-medium'>1 000 000</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {taskCompleted ? (
                                            <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                                        ) : (
                                            <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                                        )}
                                    </div>
                                </div>

                                <div onClick={taskTwo} className='bg-cards rounded-[10px] p-[14px] flex justify-between items-center'>
                                    <div className='flex flex-1 items-center space-x-2'>
                                        <div>
                                            <img src={taskbook} alt="taskbook" className='w-[50px]' />
                                        </div>
                                        <div className='flex flex-col space-y-1'>
                                            <span className='font-semibold'>Join our telegram channel update</span>
                                            <div className='flex items-center space-x-1'>
                                                <span className="w-[20px] h-[20px]">
                                                    <img src={coinsmall} className="w-full" alt="coin" />
                                                </span>
                                                <span className='font-medium'>1 000 000</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {taskCompleted2 ? (
                                            <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                                        ) : (
                                            <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                                        )}
                                    </div>
                                </div>
                                <div onClick={taskThree} className='bg-cards rounded-[10px] p-[14px] flex justify-between items-center'>
                                    <div className='flex flex-1 items-center space-x-2'>
                                        <div>
                                            <img src={taskbook} alt="taskbook" className='w-[50px]' />
                                        </div>
                                        <div className='flex flex-col space-y-1'>
                                            <span className='font-semibold'>Join our telegram group</span>
                                            <div className='flex items-center space-x-1'>
                                                <span className="w-[20px] h-[20px]">
                                                    <img src={coinsmall} className="w-full" alt="coin" />
                                                </span>
                                                <span className='font-medium'>1 000 000</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {taskCompleted3 ? (
                                            <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                                        ) : (
                                            <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={`${activeIndex === 2 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>
                                <MilestoneRewards />
                            </div>

                            <div className={`${activeIndex === 3 ? 'flex' : 'hidden'} alltaskscontainer flex-col w-full space-y-2`}>
                                <ReferralRewards />
                            </div>
                        </div>

                        <TaskOne showModal={showModal} setShowModal={setShowModal} />
                        <TaskTwo showModal={showModal2} setShowModal={setShowModal2} />
                        <TaskThree showModal={showModal3} setShowModal={setShowModal3} />
                        <ClaimLeveler claimLevel={claimLevel} setClaimLevel={setClaimLevel} />
                        <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
                    </div>
                    <Outlet />
                </Animate>
            )}
        </>
    );
};

export default Tasks;
