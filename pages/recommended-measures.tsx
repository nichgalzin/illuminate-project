import { useState, useEffect } from "react";
import { safetyMeasures, SafetyMeasure } from "../data/data";
import { useRouter } from "next/router";
import Head from "next/head";

export default function RecommendedMeasures() {
  const router = useRouter();
  // Initially show all measures without any filtering logic
  const [measures, setMeasures] = useState<SafetyMeasure[]>(safetyMeasures);
  
  // This is a starter implementation that just shows all measures
  // The candidate will need to implement the logic to filter based on risk factors and risk levels
  
  // Expected implementation:
  // 1. Load risk levels from localStorage (saved in the risk-assessment page)
  // 2. Load risk factors and answers from localStorage
  // 3. For each safety measure, check if its condition is met:
  //    - For "2 illegal harms assigned 'High' risk", count how many illegal harms have High risk level
  //    - For "High risk of [specific harm]", check if that specific harm has High risk level
  //    - For "Large service AND [condition]", check if question 3 answer is "700,000 or more" AND the other condition is met

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Risk Assessment - Recommended Measures</title>
      </Head>
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Recommended Safety Measures</h1>
        <p className="mb-6 text-gray-600">
          Based on your risk assessment, we recommend implementing the following safety measures:
        </p>
        
        <div className="space-y-4 mb-8">
          {measures.map((measure, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{measure.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{measure.reference}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Condition: {measure.condition}</p>
              <p className="mt-3">{measure.description}</p>
            </div>
          ))}
          
          {measures.length === 0 && (
            <p className="text-center py-8 text-gray-500">No measures recommended based on your risk profile.</p>
          )}
        </div>
        
        {/* Note for candidates */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold">Task for candidates:</p>
          <p>Implement the logic to filter safety measures based on risk factors and risk levels:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Add the fifth safety measure (Private Messaging Safeguards) to the data.ts file</li>
            <li>Implement logic to filter measures based on the conditions</li>
            <li>Consider risk factors from the Results page and risk levels from the Risk Assessment page</li>
            <li>For the "Large service" condition, use the answer to question 3 (over 700k users)</li>
          </ul>
        </div>
        
        <div className="flex">
          <button
            onClick={() => router.push('/risk-assessment')}
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Risk Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
