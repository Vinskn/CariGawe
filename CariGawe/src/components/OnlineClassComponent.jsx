import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from 'react-redux';
import { setExamComplete, setTotalQuestion, setTrueAnswer, setScore, setTimer } from '../redux/slicer.js/examSlicer';
import { useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard';
import supabase from '../utils/supabaseClient';

function OnlineClassComponent({ children }) {
    return <children />;
}

function MaterialCard({ id, judul, author, actionFunc }) {
    return (
        <div onClick={() => actionFunc(id)} className="border border-gray-300 rounded-xl select-none cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <img src="/images/background-classDetail.png" alt="background-classDetail" className="w-full h-40 object-cover object-center rounded-t-xl"/>
            <h1 className="mt-2 px-5 font-montserrat font-bold text-gray-700 h-16 line-clamp-3">{judul}</h1>
            <div className="mt-5 flex justify-between mx-5 mb-4 items-center">
                <h1 className="text-sm text-textBlack">{author}</h1>
                <img src="/images/arrowupgrey.svg" className="w-3" alt="go to class"/>
            </div>
        </div>
    );
}

function ClassMaterial({ daftarIsi, konten }) {
    return(
        <div className="font-montserrat text-gray-600">
            <div className="rounded-lg p-6 mb-8 bg-gray-50">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Daftar Isi</h2>
                <ol className="list-decimal list-inside space-y-1 text-blue-600">
                    {daftarIsi && Object.entries(daftarIsi).map(([key, value]) => (
                        <li key={key}>
                            <a href={`#section-${key}`} className="hover:underline">{value}</a>
                        </li>
                    ))}
                </ol>
            </div>
            {konten && Object.entries(konten).map(([key, value]) => (
                <section key={key} id={`section-${key}`} className="mb-8 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{daftarIsi[key]}</h2>
                    <p className="whitespace-pre-wrap leading-relaxed">{value}</p>
                </section>
            ))}
        </div>
    );
}

function RateClass() {
    return(
        <div className="border border-gray-300 rounded-lg p-3 font-montserrat">
            <h1 className="font-bold text-textBlack text-xl mb-2">Mau memberikan ulasan?</h1>
            <p className="text-sm text-textBlack mb-3">Berikan ulasan Anda setelah menyelesaikan kelas dan juga uji kompentensi</p>
            <textarea placeholder="Berikan Ulasan Anda" className="border border-gray-300 w-full h-30 rounded-lg p-4 resize-none mb-3"/>
            <div className="text-textBlack text-sm mb-3">
                <h1>Apakah Anda mau menampilkan nama Anda?</h1>
                <div className="flex gap-4">
                    <div className="flex gap-2 items-center"><input type="radio" id="yesName" name="showName"/><label htmlFor="yesName">Iya</label></div>
                    <div className="flex gap-2 items-center"><input type="radio" id="noName" name="showName"/><label htmlFor="noName">Tidak</label></div>
                </div>
            </div>
            <div className="text-textBlack text-sm mb-3">
                <h1>Apakah Anda terbantu dengan kelas ini?</h1>
                <div className="flex gap-4">
                     <div className="flex gap-2 items-center"><input type="radio" id="yesHelp" name="isHelpful"/><label htmlFor="yesHelp">Iya</label></div>
                     <div className="flex gap-2 items-center"><input type="radio" id="noHelp" name="isHelpful"/><label htmlFor="noHelp">Tidak</label></div>
                </div>
            </div>
            <button className="w-full mt-5 bg-blue7 hover:bg-blue6 py-1 rounded-lg text-white font-semibold">Kirim Ulasan</button>
        </div>
    );
}

function ClassExam({ insertFunc }){
    const [userAnswer, setUserAnswer] = useState({});
    const [examQuestions, setExamQuestions] = useState([]);
    const [isSubmited, setIsSubmited] = useState(false);
    const dispatch = useDispatch();
    const { id } = useParams();
    const checkExampComplete = useSelector(state => state.exam.examComplete);
    const getTimer = useSelector(state => state.exam.timer);

    const transformData = (apiData) => {
        return apiData.map(data => ({
            id: data.id,
            question: data.pertanyaan,
            choices: [data.opsi_a, data.opsi_b, data.opsi_c, data.opsi_d],
            correctAns: data[`opsi_${data.jawaban_benar.toLowerCase()}`]
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase.from('tes').select('*').eq('materi_id', id);
            if (error) {
                console.error("Error fetching exam questions: ", error);
            } else {
                setExamQuestions(transformData(data));
            }
        };
        fetchData();
    }, [id]);
    
    useEffect(() => {
        if (getTimer) {
            handleSubmit();
        }
    }, [getTimer]);

    const handleAnswer = (questionId, answer) => {
        if (checkExampComplete) return;
        setUserAnswer(prev => ({...prev, [questionId]: answer}));
    };
    
    const handleSubmit = () => {
        if (isSubmited) return;

        let correctCount = 0;
        const totalQuestions = examQuestions.length;

        examQuestions.forEach(q => {
            if (userAnswer[q.id] === q.correctAns) {
                correctCount++;
            }
        });

        const calculateScore = totalQuestions > 0 ? Math.floor((correctCount / totalQuestions) * 100) : 0;

        setIsSubmited(true);
        insertFunc(calculateScore);
        dispatch(setTotalQuestion(totalQuestions));
        dispatch(setTrueAnswer(correctCount));
        dispatch(setScore(calculateScore));
    };

    return(
        <div className={`font-montserrat text-textBlack ${checkExampComplete && "cursor-not-allowed"}`}>
            {examQuestions.map((question) => {
                const isSelected = (choice) => userAnswer[question.id] === choice;
                const isCorrect = (choice) => question.correctAns === choice;
                
                return (
                    <div key={question.id} className={`mb-5 ${checkExampComplete && "pointer-events-none"}`}>
                        <h1 className='text-lg mb-1 select-none'>{`${question.id}. `}{question.question}</h1>
                        <div>
                            {question.choices.map((choice, i) => {
                                let choiceStyle = "border-gray-300";
                                let imgSrc = null;

                                if (isSubmited && isCorrect(choice)) {
                                    choiceStyle = "ring-2 ring-green-500 border-green-500";
                                    imgSrc = "/images/CheckCircle.svg";
                                } else if (isSubmited && isSelected(choice) && !isCorrect(choice)) {
                                    choiceStyle = "ring-2 ring-red-500 border-red-500";
                                    imgSrc = "/images/XCircle.svg";
                                } else if (isSelected(choice)) {
                                    choiceStyle = "ring-2 ring-blue6 border-blue6";
                                }

                                return (
                                    <h1 key={i} onClick={() => handleAnswer(question.id, choice)}
                                        className={`relative border rounded-lg mb-2 py-2 px-15 select-none cursor-pointer transition-all duration-200 ${choiceStyle}`}>
                                        <span className='bg-gray-200 absolute py-2 rounded-l-lg px-5 top-0 left-0 h-full flex items-center'>{String.fromCharCode(65 + i)}</span>
                                        <span className="ml-16">{choice}</span>
                                        {imgSrc && <img src={imgSrc} className='absolute top-1/2 transform -translate-y-1/2 right-0 mx-5 w-5' alt="status" />}
                                    </h1>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            <div className='font-montserrat flex justify-end'>
                 <button className={`bg-blue7 hover:bg-blue6 font-bold text-white py-1 px-5 rounded-lg ${checkExampComplete && "bg-gray-400 hover:bg-gray-400 pointer-events-none"}`}
                    onClick={handleSubmit}>
                    Kirim Jawaban
                </button>
            </div>
        </div>
    );
}

function ClassTimer() {
    const dispatch = useDispatch();
    const handleComplete = () => dispatch(setTimer(true));
    const renderer = ({ minutes, seconds, completed }) => completed ? <span>Waktu Habis!</span> : <span>{minutes}:{seconds}</span>;

    return (
        <div className='border border-gray-300 rounded-lg p-5 mb-5 font-montserrat'>
            <h1 className='text-textBlack font-bold text-xl mb-3'>Waktu tersisa:</h1>
            <div className='flex justify-center text-blue6 text-6xl font-bold tracking-widest'>
                <Countdown date={Date.now() + 10 * 60 * 1000} renderer={renderer} onComplete={handleComplete}/>
            </div>
        </div>
    );
}

function ClassGrade() {
    const correctAnswer = useSelector(state => state.exam.trueAnswer);
    const totalQuestions = useSelector(state => state.exam.totalQuestion);
    const examScore = useSelector(state => state.exam.score);

    return(
        <div className='border border-gray-300 rounded-lg p-5 mb-5 font-montserrat'>
            <div className='flex justify-between items-center'>
                <h1 className='text-textBlack font-bold text-xl mb-3'>Skor Akhir</h1>
                {totalQuestions > 0 && <h1>{correctAnswer} / {totalQuestions} Benar</h1>}
            </div>
            <h1 className='text-center text-blue6 text-6xl font-bold tracking-widest'>{examScore}</h1>
        </div>
    );
}

function ClassReview() {
    return (
        <div>
            <ReviewCard/>
            <ReviewCard/>
            <ReviewCard/>
        </div>
    );
}

OnlineClassComponent.MaterialCard = MaterialCard;
OnlineClassComponent.ClassMaterial = ClassMaterial;
OnlineClassComponent.RateClass = RateClass;
OnlineClassComponent.ClassExam = ClassExam;
OnlineClassComponent.ClassTimer = ClassTimer;
OnlineClassComponent.ClassGrade = ClassGrade;
OnlineClassComponent.ClassReview = ClassReview;
export default OnlineClassComponent;