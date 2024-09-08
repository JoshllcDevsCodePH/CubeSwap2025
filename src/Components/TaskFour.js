    import coinsmall from "../images/coinsmall.webp";
    import claim from "../images/claim.webp";
    import { useEffect, useState } from "react";
    import { db } from "../firebase";
    import {
    collection,
    getDoc,
    getDocs,
    updateDoc,
    doc,
    setDoc,
    } from "firebase/firestore";
    import { useUser } from "../context/userContext";

    const TaskFour = ({ showModal, setShowModal }) => {
    const { id, balance, setBalance, taskCompleted, setTaskCompleted } = useUser();

    const [showTaskButton, setShowTaskButton] = useState(true);
    const [message, setMessage] = useState("");
    const [videoWatched, setVideoWatched] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const taskID = "task_3200"; // Assign a unique ID to this task
    const [openComplete, setOpenComplete] = useState(false);
    const [isMissionButtonDisabled, setIsMissionButtonDisabled] = useState(true);

    useEffect(() => {
        const handleBackButtonClick = () => {
        setShowModal(false);
        document.getElementById("footermain").style.zIndex = "";
        };

        if (showModal) {
        window.Telegram.WebApp.BackButton.show();
        window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
        } else {
        window.Telegram.WebApp.BackButton.hide();
        window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        }

        return () => {
        window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        };
    }, [showModal, setShowModal]);

    useEffect(() => {
        if (id) {
        checkTaskCompletion(id, taskID).then((completed) => {
            setTaskCompleted(completed);
            if (completed) {
            setMessage("");
            setIsMissionButtonDisabled(false);
            }
        });
        }
    }, [id]);

    const handleVideoEnd = () => {
        setVideoWatched(true);
        setMessage("You have watched the full ad. You can now claim your reward.");
        setIsMissionButtonDisabled(false);
    };

    const handleTaskLinkClick = () => {
        setVideoPlaying(true);
        setShowTaskButton(false);
    };

    const checkTaskCompletion = async (id, taskId) => {
        try {
        const userTaskDocRef = doc(db, "userTasks", `${id}_${taskId}`);
        const docSnap = await getDoc(userTaskDocRef);
        if (docSnap.exists()) {
            return docSnap.data().completed;
        } else {
            return false;
        }
        } catch (e) {
        console.error("Error checking task completion: ", e);
        return false;
        }
    };

    const saveTaskCompletionToFirestore = async (id, taskId, isCompleted) => {
        try {
        const userTaskDocRef = doc(db, "userTasks", `${id}_${taskId}`);
        await setDoc(
            userTaskDocRef,
            { userId: id, taskId: taskId, completed: isCompleted },
            { merge: true }
        );
        } catch (e) {
        console.error("Error saving task completion status: ", e);
        }
    };

    const updateUserCountInFirestore = async (id, newBalance) => {
        try {
        const userRef = collection(db, "telegramUsers");
        const querySnapshot = await getDocs(userRef);
        let userDocId = null;
        querySnapshot.forEach((doc) => {
            if (doc.data().userId === id) {
            userDocId = doc.id;
            }
        });

        if (userDocId) {
            const userDocRef = doc(db, "telegramUsers", userDocId);
            await updateDoc(userDocRef, { balance: newBalance });
        } else {
            console.error("User document not found.");
        }
        } catch (e) {
        console.error("Error updating user count in Firestore: ", e);
        }
    };

    const finishMission = async () => {
        setShowModal(false);
        setOpenComplete(false);
        document.getElementById("congrat").style.opacity = "1";
        document.getElementById("congrat").style.visibility = "visible";
        setTimeout(() => {
        document.getElementById("congrat").style.opacity = "0";
        document.getElementById("congrat").style.visibility = "invisible";
        }, 2000);

        const newCount = balance + 1000000;
        setBalance(newCount);
        setMessage("");
        setIsMissionButtonDisabled(true);
        await saveTaskCompletionToFirestore(id, taskID, true);
        await updateUserCountInFirestore(id, newCount);
        setTaskCompleted(true);
    };

    const handleComplete = () => {
        setOpenComplete(true);
        document.getElementById("footermain").style.zIndex = "";
    };

    return (
        <>
        {showModal ? (
            <div className="fixed z-50 left-0 right-0 top-0 bottom-0 flex justify-center taskbg px-[16px] h-full">
            <div className={`w-full flex flex-col items-center justify-start`}>
                <div className="w-full flex justify-start py-2"></div>
                <div className="flex w-full flex-col">
                <h1 className="text-[20px] font-semibold">Watch an Ad</h1>
                <p className="text-[#9a96a6] text-[16px] font-medium pt-1 pb-10">
                    Watch an ad to earn rewards.
                </p>

                <p className="w-full text-center text-[14px] font-semibold text-[#49ee49] pb-4">
                    {taskCompleted ? "Task is Completed" : ""}
                </p>
                <div className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center">
                    <div className="flex flex-1 items-center space-x-2">
                    <div className="">
                        <img src={coinsmall} className="w-[50px]" alt="Coin Icon" />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="font-semibold">Reward</span>
                        <div className="flex items-center">
                        <span className="font-medium">1 000 000</span>
                        </div>
                    </div>
                    </div>
                </div>
                <h1 className="text-[20px] font-semibold pt-6 pb-4 px-2">Your Tasks</h1>
                <div className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center">
                    <div className="flex flex-1 items-center space-x-2">
                    <div className="flex flex-col space-y-1">
                        <span className="font-semibold">Watch the Ad</span>
                        {message && (
                        <span className="text-[#ea5b48] text-[12px] pr-8">
                            {message}
                        </span>
                        )}
                    </div>
                    </div>
                    <div className="">
                    {taskCompleted ? (
                        <></>
                    ) : (
                        <>
                        {showTaskButton && (
                            <button
                            onClick={handleTaskLinkClick}
                            className={`flex font-medium bg-btn hover:bg-[#1e3356] ease-in duration-300 py-[6px] px-4 rounded-[8px] items-center justify-center text-[16px]`}
                            >
                            Go
                            </button>
                        )}
                        </>
                    )}
                    </div>
                </div>
                {videoPlaying && (
                    <div className="video-container">
                    <video
                        width="100%"
                        controls
                        onEnded={handleVideoEnd}
                        style={{ marginTop: "20px" }}
                    >
                        <source src="https://example.com/ad-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </div>
                )}
                {taskCompleted || videoWatched ? (
                    <>
                    <button
                        className={`my-6 w-full py-5 px-3 flex items-center rounded-[12px] justify-center text-center text-[20px] font-medium text-[#6a6978] bg-btn2`}
                    >
                        Mission Completed
                    </button>
                    </>
                ) : (
                    <>
                    <button
                        onClick={() => handleComplete(true)}
                        disabled={isMissionButtonDisabled}
                        className={`my-6 w-full py-5 px-3 flex items-center rounded-[12px] justify-center text-center text-[20px] font-medium 
                                            ${
                                            isMissionButtonDisabled
                                                ? "text-[#6a6978] bg-btn2"
                                                : "text-[#f4f4f4] bg-btn"
                                            }`}
                    >
                        Finish Mission
                    </button>
                    </>
                )}
                </div>

                <div
                className={`w-full bg-cards rounded-[10px] px-4 py-5 flex flex-col justify-between items-center fixed bottom-0 left-0 right-0 ${
                    openComplete ? "visible" : "hidden"
                }`}
                >
                <div className="w-full">
                    <div className="w-full flex flex-col justify-between items-center">
                    <div className="w-[120px] h-[120px] bg-[#30364e] rounded-full flex items-center justify-center mb-4">
                        <img src={claim} className="w-[70px]" alt="Claim Icon" />
                    </div>
                    <h2 className="text-[22px] font-semibold py-4">Mission Completed!</h2>
                    <p className="text-[#9a96a6] text-[16px] font-medium text-center">
                        You have completed the task. Please press the button to claim your reward.
                    </p>
                    </div>
                    <button
                    className={`w-full py-4 px-3 flex items-center rounded-[12px] justify-center text-center text-[20px] font-medium text-[#f4f4f4] bg-btn`}
                    onClick={finishMission}
                    >
                    Claim Reward
                    </button>
                </div>
                </div>
            </div>
            </div>
        ) : (
            ""
        )}
        </>
    );
    };

    export default TaskFour;