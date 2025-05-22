import { useState } from 'react';
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

const total = questions.length;

type QuestionUnion =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | OpenQuestion
  | OrderingQuestion
  | MatchingQuestion;
   
export default function App() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerType>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const q = questions[current] as QuestionUnion;
  const answer = answers[q.id];

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
      setCurrent(0);
      setShowFeedback(false);
      setAnswers({});
    }
  };

  return (
    <div className='flex flex-col sm:items-center sm:justify-center py-4 px-4 sm:py-8 sm:px-16 border'>
      <div className="flex flex-col xl:w-[1280px]">
        <div className="text-2xl font-bold text-[#313642]">
          Pytanie {current + 1} z {total}
        </div>

        <QuestionCard question={q} answer={answer} onAnswer={handleAnswer} />

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
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
       
       {showFeedback && (
            <span
              className={
                checkCorrect(q, answer)
                  ? 'text-green-600 font-bold'
                  : 'text-red-600 font-bold'
              }
            >
              {checkCorrect(q, answer) ? '✔ Poprawna' : '✖ Błędna'}
            </span>
          )}
      </div>
    </div>
  );
}
