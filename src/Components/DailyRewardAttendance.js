import React, { useEffect, useState } from 'react';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from '../context/userContext';
import { IoCheckmarkCircle } from 'react-icons/io5';
import congratspic from "../images/celebrate.gif";
import Animate from '../Components/Animate';
import ref from "../images/ref.webp";
import coinsmall from "../images/coinsmall.webp";

const dailyRewards = [
  { day: 1, reward: 100 },
  { day: 2, reward: 200 },
  { day: 3, reward: 300 },
  { day: 4, reward: 400 },
  { day: 5, reward: 500 },
  { day: 6, reward: 600 },
  { day: 7, reward: 700 },
  { day: 8, reward: 800 },
  { day: 9, reward: 900 },
  { day: 10, reward: 1000 }
];

const DailyReward = () => {
  const { balance, setBalance, id, claimedDailyTasks, setClaimedDailyTasks } = useUser();
  const [congrats, setCongrats] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState(null);

  useEffect(() => {
    const initializeUserRewards = async () => {
      try {
        const userRef = doc(db, 'telegramUsers', id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setClaimedDailyTasks(data.claimedDailyTasks || {});
          setNextClaimTime(data.nextClaimTime || null);
        } else {
          await updateDoc(userRef, { claimedDailyTasks: {}, nextClaimTime: null });
          setClaimedDailyTasks({});
          setNextClaimTime(null);
        }
      } catch (error) {
        console.error("Error initializing user rewards:", error);
      }
    };

    initializeUserRewards();
  }, [id, setClaimedDailyTasks]);

  useEffect(() => {
    if (nextClaimTime) {
      const now = new Date().getTime();
      const timeRemaining = nextClaimTime - now;

      if (timeRemaining <= 0) {
        setNextClaimTime(null);
      } else {
        setTimeout(() => {
          setNextClaimTime(null);
        }, timeRemaining);
      }
    }
  }, [nextClaimTime]);

  const today = new Date().getDate();
  const todayReward = dailyRewards.find(reward => reward.day === today) || { reward: 0 };
  const hasClaimedToday = claimedDailyTasks && claimedDailyTasks[today];
  const isButtonDisabled = hasClaimedToday || isClaiming || nextClaimTime;

  const handleClaimReward = async () => {
    if (isButtonDisabled) {
      return;
    }

    setIsClaiming(true);
    setCongrats(true);

    try {
      const newBalance = balance + todayReward.reward;
      const userRef = doc(db, 'telegramUsers', id);
      const newClaimTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      await updateDoc(userRef, {
        balance: newBalance,
        [`claimedDailyTasks.${today}`]: true,
        nextClaimTime: newClaimTime
      });

      setBalance(newBalance);
      setClaimedDailyTasks(prev => ({
        ...prev,
        [today]: true
      }));

      setTimeout(() => {
        setCongrats(false);
        setIsClaiming(false);
      }, 3000); // 3-second duration for the congrats pop-up
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      setIsClaiming(false);
    }
  };

  return (
    <Animate>
      <div className="w-full flex flex-col space-y-4 p-4">
        <div className='bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center'>
          <div className='flex flex-1 items-center space-x-2'>
            <div>
              <img src={ref} alt="Daily Reward" className='w-[55px]' />
            </div>
            <div className='flex flex-col space-y-1'>
              <span className='font-semibold'>
                Daily Reward for Day {today}
              </span>
              <div className='flex items-center space-x-1'>
                <span className="w-[20px] h-[20px]">
                  <img src={coinsmall} className="w-full" alt="coin" />
                </span>
                <span className='font-medium'>
                  {todayReward.reward} Coins
                </span>
              </div>
            </div>
          </div>

          <div>
            <button
              disabled={isButtonDisabled}
              onClick={handleClaimReward}
              className={`relative rounded-[8px] font-semibold py-2 px-3 ${isButtonDisabled ? 'bg-btn2 text-[#fff6]' : 'bg-btn text-white'}`}>
              {hasClaimedToday ? 'Already Claimed' : 'Claim Reward'}
            </button>
          </div>
        </div>

        {congrats && (
          <div className="w-full fixed top-[-35px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none">
            <img src={congratspic} alt="congrats" className="w-[80%]" />
          </div>
        )}

        {congrats && (
          <div className="w-full fixed bottom-6 left-0 right-0 px-4 z-[60] ease-in duration-300">
            <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
              <IoCheckmarkCircle size={24} />
              <span className="font-medium">
                Good Job!
              </span>
            </div>
          </div>
        )}
      </div>
    </Animate>
  );
};

export default DailyReward;
