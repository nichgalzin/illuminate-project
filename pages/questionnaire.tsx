import { useState, useEffect } from "react";
import { questionnaireData, Question } from "../data/data";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Questionnaire() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  
  // Load saved answers from localStorage when the page loads
  useEffect(() => {
    const savedAnswers = localStorage.getItem("questionnaireAnswers");
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error("Error parsing saved answers:", error);
      }
    }
  }, []);

  const handleChange = (questionId: string, value: string, type: string) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (type === "checkbox") {
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        return { ...prev, [questionId]: updated };
      } else {
        return { ...prev, [questionId]: [value] };
      }
    });
  };

  const handleSubmit = () => {
    localStorage.setItem("questionnaireAnswers", JSON.stringify(answers));
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Risk Assessment - Questionnaire</title>
      </Head>
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Service Risk Assessment Questionnaire</h1>
        <p className="mb-6 text-gray-600">Please answer the following questions about your service to help us identify potential risk factors.</p>
        
        {questionnaireData.questions.map((q) => (
          <div key={q.id} className="mb-8 p-4 bg-white rounded-lg shadow">
            <p className="font-semibold text-lg mb-3">{q.text}</p>
            <div className="pl-2">
              {q.options.map((opt) => (
                <label key={opt.value} className="mb-2 flex items-start">
                  <input
                    type={q.type}
                    name={q.id}
                    value={opt.value}
                    checked={answers[q.id]?.includes(opt.value) || false}
                    onChange={() => handleChange(q.id, opt.value, q.type)}
                    className="mr-2 mt-1"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        {/* Note for candidates */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold">Task for candidates:</p>
          <p>In Task 1, you'll need to add a fourth illegal harm "Drugs and psychoactive substances" and link it to the appropriate risk factors.</p>
        </div>
        
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={Object.keys(answers).length === 0}
        >
          Submit and Continue
        </button>
      </div>
    </div>
  );
}
