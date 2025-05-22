import React, { useEffect, useState } from 'react';
import type {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  OpenQuestion,
  OrderingQuestion,
  MatchingQuestion,
} from '../types/types';
import Checkbox from './Checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from './Button';

export type QuestionUnion =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | OpenQuestion
  | OrderingQuestion
  | MatchingQuestion;

export type AnswerType =
  | string
  | string[]
  | Record<string, string>;

export interface QuestionCardProps {
  question: QuestionUnion;
  answer: AnswerType;
  onAnswer: (id: string, answer: AnswerType) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer, onAnswer }) => {
  useEffect(() => {
    if (question.type === 'ordering' && !Array.isArray(answer)) {
      onAnswer(question.id, question.options);
    }
  }, [question, answer, onAnswer]);

  const handleSingle = (opt: string) => {
    onAnswer(question.id, opt);
  };

  const handleMultiple = (opt: string) => {
    const arr = Array.isArray(answer) ? [...answer] : [];
    const idx = arr.indexOf(opt);
    if (idx > -1) arr.splice(idx, 1);
    else arr.push(opt);
    onAnswer(question.id, arr);
  };

  const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswer(question.id, e.target.value);
  };

  const handleOrdering = (from: number, to: number) => {
    const ordQ = question as OrderingQuestion;
    const currentOrder = Array.isArray(answer) ? answer : ordQ.options;
    if (to < 0 || to >= currentOrder.length) return;
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, moved);
    onAnswer(question.id, newOrder);
  };

  const handleMatch = (left: string, right: string) => {
    const curr = typeof answer === 'object' && !Array.isArray(answer) ? { ...answer } : {};
    curr[left] = right;
    onAnswer(question.id, curr);
  };

  const [shuffledOrdering, setShuffledOrdering] = useState<string[]>([]);
  const [shuffledMatchingLeft, setShuffledMatchingLeft] = useState<string[]>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (question.type === 'ordering') {
      const shuffled = shuffleArray(question.options);
      setShuffledOrdering(shuffled);
    
      if (!Array.isArray(answer)) {
        onAnswer(question.id, shuffled);
      }
    }
    if (question.type === 'matching') {
      setShuffledMatchingLeft(shuffleArray(question.leftItems));
    }
  }, [question]);

  return (
    <div className='min-h-72'>
      <p className="text-xl text-[#313642] mt-3 xl:mt-6 xl:text-3xl">{question.question}</p>

      {question.type === 'single' && (
        <div className="flex flex-col space-y-2 mt-4">
          {question.options.map(opt => (
            <label
              key={opt}
              className="flex flex-wrap items-start gap-3"
            >
              <Checkbox
                size={32}
                checked={answer === opt}
                onChange={() => handleSingle(opt)}
              />
              <span className="flex-1 break-words text-lg xl:text-2xl text-[#16191E]">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'multiple' && (
        <div className="flex flex-col space-y-2 mt-4">
          {question.options.map(opt => (
             <label
              key={opt}
              className="flex flex-wrap items-start gap-3"
            >
              <Checkbox
                size={32}
                checked={Array.isArray(answer) && answer.includes(opt)}
                onChange={() => handleMultiple(opt)}
              />
              
              <span className="flex-1 break-words text-lg xl:text-2xl text-[#16191E]">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'open' && (
        <input
          type="text"
          value={typeof answer === 'string' ? answer : ''}
          onChange={handleOpen}
          className="w-full p-2 border rounded border-[#DEE1E5] h-9 xl:h-10 mt-4"
        />
      )}

      {question.type === 'ordering' && (
      <div className="mt-4">
        {(Array.isArray(answer) ? answer : shuffledOrdering).map((item, idx) => (
          <div key={item} className="flex items-center mb-2">
            <span className="flex items-center gap-3 text-lg xl:text-2xl text-[#16191E] flex-1">{item}</span>
            <div className="flex space-x-1">
              <Button 
                size='m'
                type='icon'
                Icon={ChevronUp}
                onClick={() => handleOrdering(idx, idx - 1)}
                disabled={idx === 0}
              />
              <Button 
                size='m'
                type='icon'
                Icon={ChevronDown}
                onClick={() => handleOrdering(idx, idx + 1)}
                disabled={idx === (Array.isArray(answer) ? answer.length - 1 : shuffledOrdering.length - 1)}
              />
            </div>
          </div>
        ))}
      </div>
      )}

      {question.type === 'matching' && (
      <div className="grid grid-cols-1 gap-4 mt-4">
        {shuffledMatchingLeft.map(left => (
          <div key={left} className="flex items-center space-x-4">
            <span className="flex items-center gap-3 text-lg xl:text-2xl w-80 text-[#16191E] whitespace-nowrap overflow-hidden text-ellipsis">
              {left}
            </span>
            <select
              value={typeof answer === 'object' && !Array.isArray(answer) && answer[left] ? answer[left] : ''}
              onChange={e => handleMatch(left, e.target.value)}
              className="py-1 px-4 border rounded border-[#DEE1E5] w-48 xl:h-10 xl:w-full"
              style={{ whiteSpace: 'normal' }}
            >
              <option value="" className="disabled hidden">Wybierz</option>
              {question.rightItems.map(right => (
                <option
                  key={right}
                  value={right}
                  className="xl:text-lg"
                  style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}
                >
                  {right}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    )}
    </div>
  );
};