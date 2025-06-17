import { useState, useEffect } from 'react';
import questions from './data/question.json';
import { QuestionCard, type AnswerType } from './components/QuestionCard';
import type {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  OpenQuestion,
  OrderingQuestion,
  MatchingQuestion,
} from './types/types';
import Button from './components/Button';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

type QuestionUnion =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | OpenQuestion
  | OrderingQuestion
  | MatchingQuestion;

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
   
export default function App() {
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof questions>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerType>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
  }, []);

  const total = shuffledQuestions.length;
  const q = shuffledQuestions[current] as QuestionUnion;
  const answer = answers[q?.id];

  if (shuffledQuestions.length === 0 || !q) {
    return <div className="flex justify-center items-center h-screen">Ładowanie pytań...</div>;
  }

  const handleAnswer = (id: string, ans: AnswerType) => {
    setAnswers(prev => ({ ...prev, [id]: ans }));
    setShowFeedback(false);
  };

  const checkCorrect = (question: QuestionUnion, ans: AnswerType) => {
    switch (question.type) {
      case 'single':
        return ans === question.correctAnswer;
      case 'multiple':
        return (
          Array.isArray(ans) &&
          question.correctAnswers.length === ans.length &&
          question.correctAnswers.every(a => ans.includes(a))
        );
      case 'open':
        return (
          typeof ans === 'string' &&
          question.correctAnswers.some(c => c.trim().toLowerCase() === ans.trim().toLowerCase())
        );
      case 'ordering':
        return (
          Array.isArray(ans) &&
          ans.length === question.options.length &&
          ans.every((o, i) => o === question.options[i])
        );
      case 'matching':
        if (typeof ans !== 'object' || Array.isArray(ans)) return false;
        return question.leftItems.every(
          left => ans[left] === question.correctMap[left]
        );
      default:
        return false;
    }
  };

  const goNext = () => {
    if (current < total - 1) {
      setCurrent(current + 1);
      setShowFeedback(false);
    } else {
      const newShuffledQuestions = shuffleArray(questions);
      setShuffledQuestions(newShuffledQuestions);
      setCurrent(0);
      setShowFeedback(false);
      setAnswers({});
    }
  };

  const getCorrectAnswerText = (question: QuestionUnion): string => {
    switch (question.type) {
      case 'single':
        return question.correctAnswer;
      case 'multiple':
        return question.correctAnswers.join(', ');
      case 'open':
        return question.correctAnswers.join(', ');
      case 'ordering':
        return question.options.join(' → ');
      case 'matching':
        return question.leftItems.map(left => `${left} → ${question.correctMap[left]}`).join(', ');
      default:
        return '';
    }
  };


  return (
    <div className='flex flex-col sm:items-center sm:justify-center py-4 px-4 sm:py-8 sm:px-16'>
      <div className="flex flex-col xl:w-[1024px]">
        <div className='flex gap-4 items-center'>
          <div className="text-2xl font-bold text-[#313642] lg:text-5xl">
            Pytanie {current + 1} z {total}
          </div>
          {showFeedback && (
            <span
              className={
                checkCorrect(q, answer)
                  ? 'text-green-600 font-bold mt-1 lg:text-2xl'
                  : 'text-red-500 font-bold mt-1 lg:text-2xl'
              }
            >
             {checkCorrect(q, answer) ? (
                <span className="text-green-600 font-bold mt-1 lg:text-2xl">
                  ✔ Poprawna
                </span>
              ) : (
                <div className="text-red-500 font-bold mt-1 lg:text-2xl flex-row">
                  ✖ Błędna
                  <div className="text-[#313642] font-normal text-base lg:text-xl mt-1">
                    Poprawna odpowiedź: <span className="font-semibold">{getCorrectAnswerText(q)}</span>
                  </div>
                </div>
              )}
            </span>
          )}
        </div>
       
        {q && <QuestionCard question={q} answer={answer} onAnswer={handleAnswer} />}

        <div className="mt-4 flex flex-col sm:flex-row">
          <div className='flex flex-col gap-4 xl:hidden'>
            <Button 
              text='Poprzednie'
              size='m'
              width='w-full sm:w-fit'
              type='secondary'
              Icon={ChevronLeft}
              onClick={() => setCurrent(curr => Math.max(0, curr - 1))}
              disabled={current === 0}
            />
            <Button 
              text='Sprawdź'
              size='m'
              width='w-full sm:w-fit'
              type='primary'
              Icon={Eye}
              onClick={() => setShowFeedback(true)}
            />
            <Button 
              text={current < total - 1 ? 'Następne' : 'Restart'}
              size='m'
              width='w-full sm:w-fit'
              type='secondary'
              Icon={ChevronRight}
              onClick={goNext}
            />
          </div>
          
          <div className='hidden xl:flex gap-4'>
            <Button 
              text='Poprzednie'
              size='l'
              width='w-full sm:w-fit'
              type='secondary'
              Icon={ChevronLeft}
              onClick={() => setCurrent(curr => Math.max(0, curr - 1))}
              disabled={current === 0}
            />

            <Button 
              text='Sprawdź'
              size='l'
              width='w-full sm:w-fit'
              type='primary'
              Icon={Eye}
              onClick={() => setShowFeedback(true)}
            />

            <Button 
              text={current < total - 1 ? 'Następne' : 'Restart'}
              size='l'
              width='w-full sm:w-fit'
              type='secondary'
              Icon={ChevronRight}
              onClick={goNext}
            />
          </div> 
        </div>
      </div>
    </div>
  );
}
