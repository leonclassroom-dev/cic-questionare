import { useState } from 'react';
import { questions } from './questions';
import axios from 'axios';
import imageFront from '../assets/img1.jpeg'
import imageBack from '../assets/img2.jpeg'


function Questionnaire({ question, language }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [answers, setAnswers] = useState([]);
  const [email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [multipleScore, setMultipleScore] = useState(0);

  const handleAnswer = (index) => {
    setSelectedOptions(selectedOptions);
    // setAnswers([...answers, questions[currentQuestionIndex].scores[index]]);
    questions[currentQuestionIndex].multipleAnswers === true ?
    setTotalScore((prev)=> prev + multipleScore)
    : setTotalScore((prev)=> prev + questions[currentQuestionIndex].scores[index]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setMultipleScore(0)
  };

  const handleEmailInput = (event) =>  setEmail(event.target.value);

  const handleNameInput = (event) => setName(event.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Name = e.target[0].value;
    const gender = e.target[1].value;
    const doB = e.target[2].value;
    const email = e.target[3].value;
    const reqBody = { Name, gender, doB, email, totalScore };
    
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}submission`, reqBody);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }}


  const getScoreInterpretation = (score) => {
    if (score >= 85) {
      return language === 'en' ? 
        "Congratulations! You demonstrate a strong commitment to teaching and possess the qualities of an excellent and qualified teacher." :
        "Tahniah! Anda menunjukkan komitmen yang tinggi terhadap pengajaran dan memiliki kualiti sebagai guru yang hebat dan berkelayakan.";
    } else if (score >= 70) {
      return language === 'en' ? 
        "You have some potential as a teacher but may need to work on certain aspects of your teaching approach and style." :
        "Anda memiliki potensi sebagai seorang guru tetapi anda mungkin perlu meningkatkan diri dalam beberapa aspek seperti gaya dan pendekatan pengajaran anda.";
    } else if (score >= 50) {
      return language === 'en' ? 
        "You may need to further develop your teaching skills and attitudes to be an effective and qualified teacher." :
        "Anda mungkin perlu meningkatkan kemahiran pengajaran anda dengan lebih lanjut untuk menjadi seorang guru yang efektif dan berkualiti.";
    } else {
      return language === 'en' ? 
        "You may need to assess your suitability for a teaching role and consider further professional development." :
        "Anda mungkin perlu menilai kesesuaian anda sebagai seorang guru dan berusaha untuk menghadiri kursus atau sambung belajar dalam bidang pendidikan untuk menjadi seorang guru yang efektif dan berkualiti.";
    }
  };

  if (isSubmitted) { // If form is submitted
    return (
      <div className='flex flex-col items-center '>
        {totalScore >= 85 && 
          <div className='flex justify-center'>
            <img className=' w-1/2 h-auto' src={imageFront} alt="front" /> 
            <img className=' w-1/2 h-auto' src={imageBack} alt="back" /> 
          </div>
          }
        
        <h2 className='text-3xl font-bold py-3 my-3'>Thank you for submitting! Your total score is {totalScore}.</h2>
        <p>{getScoreInterpretation(totalScore)}</p>
      </div>
    );
  }


  if (currentQuestionIndex >= questions.length) {
    return (
      <div className='flex flex-col items-center '>
        <h2 className='text-3xl font-bold py-3 my-3'>Enter your details to see your total score:</h2>
        <form  onSubmit={(event) => handleSubmit(event)} className='flex flex-col gap-2'>
          {/* name */}
            <input placeholder='Name' className=' p-2 h-10 rounded-lg w-60' type="Name" value={Name} name='Name' id='Name' onChange={handleNameInput} />
            {/* Gender */}
                <select id="gender" className='h-10 rounded-lg' name="gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select>
            {/* date of birth */}
            <label htmlFor="DoB">Date of Birth</label>
            <input className=' h-10 rounded-lg w-60' name='doB' id='doB' type="date" min="1960-01-01" max="2010-01-01" />
            {/* email */}
            <input placeholder='Email' className=' p-2 h-10 rounded-lg w-60' type="email" value={email} name='email' id='email' onChange={handleEmailInput} />

            <button className='max-[300px]: bg-purple-600 shadow-lg text-white py-2 px-4 rounded-lg m-3' type='submit'>Submit</button>

        </form>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <h3>{currentQuestionIndex+1}/{questions.length}</h3>
        <h2 className='text-3xl font-bold py-3 mb-4'>{language === 'en' ? questions[currentQuestionIndex].question : questions[currentQuestionIndex].translation}</h2>
        <div className=' grid gap-3 items-center justify-center'>

        {questions[currentQuestionIndex].options.map((option, index) => {
          
          return  (
              <AnsButton handleAnswer={handleAnswer} currentQuestionIndex={currentQuestionIndex} multipleScore={multipleScore} setMultipleScore={setMultipleScore} index={index} >
            {language === 'en' ? option : questions[currentQuestionIndex].translationOptions[index]}
          </AnsButton>
          )})}

          { questions[currentQuestionIndex].multipleAnswers === true  &&
            <button className='
            max-[300px]: bg-red-600
            text-white
            shadow-lg
            py-2 px-4 
            hover:bg-red-900
            rounded-lg' 
            onClick={()=>{
              handleAnswer(0)
            }}
            >Submit</button>
          }
          </div>
        
    </div>
    
    
  );
}


export default Questionnaire;

function AnsButton(props) {
const {handleAnswer, currentQuestionIndex,multipleScore, setMultipleScore, index, children} = props
 const [pressed, setPressed] = useState(false)

 return (
  <button 
              className='
              max-[300px]: bg-purple-600
              text-white
              shadow-lg
              py-2 px-4 
              hover:bg-purple-900
              rounded-lg'
              
              key={index} onClick={() => {
                console.log(questions[currentQuestionIndex].multipleAnswers)
                if (questions[currentQuestionIndex].multipleAnswers === true ) {
                  if (!setPressed) {
                    setPressed(true)
                    setMultipleScore((prev)=>prev + questions[currentQuestionIndex].scores[index])
                  }
                  if (setPressed) {
                    setPressed(false)
                    setMultipleScore((prev)=>prev - questions[currentQuestionIndex].scores[index])
                  }
                  return
                } 
                handleAnswer(index)
                }}>
                {children}
          </button>
 )

}