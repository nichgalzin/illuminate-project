import { useEffect, useState } from "react";
import { riskFactors, illegalHarms, riskFactorDescriptions } from "../data/data";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Results() {
  const router = useRouter();
  const [riskList, setRiskList] = useState<string[]>(["terrorism", "hate", "harassment"]);
  const [riskFactorList, setRiskFactorList] = useState<string[]>(["socialMedia", "gaming", "marketplace", "directMessaging", "commenting", "postingImages"]);
  
  // This is a starter implementation that just shows all risk factors
  // The candidate will need to implement the logic to filter based on questionnaire answers

  useEffect(() => {
    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem("questionnaireAnswers");
    if (savedAnswers) {
      try {
        const answers = JSON.parse(savedAnswers);
        // Here the candidate would implement filtering logic based on answers
        // Expected implementation:
        // 1. For question 1 (service type), add the selected service type to riskFactorList
        // 2. For question 2 (features), add each selected feature to riskFactorList
        // 3. For question 3 (user count), if "700,000 or more" is selected, this indicates a "Large Service"
        //    which should be considered when filtering safety measures later
        // 4. For each risk factor, add its associated illegal harms from the riskFactors object to riskList
      } catch (error) {
        console.error("Error parsing saved answers:", error);
      }
    }
    
    // Store the risks in localStorage for the next step
    localStorage.setItem("calculatedRisks", JSON.stringify(riskList));
    localStorage.setItem("riskFactors", JSON.stringify(riskFactorList));
  }, [riskList, riskFactorList]);

  const handleContinue = () => {
    router.push("/risk-assessment");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Risk Assessment - Results</title>
      </Head>
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Identified Risk Factors</h1>
        <p className="mb-6 text-gray-600">
          Based on your answers, we've identified the following potential risk factors for your service:
        </p>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {riskFactorList.length > 0 ? (
            <div className="space-y-8">
              {riskFactorList.map((factorId, idx) => {
                const factorInfo = riskFactorDescriptions.find(f => f.id === factorId);
                if (!factorInfo) return null;
                
                return (
                  <div key={idx} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{factorInfo.name}</h3>
                    <p className="text-gray-600 mb-4">{factorInfo.description}</p>
                    
                    <h4 className="font-medium text-gray-700 mb-2">Key kinds of illegal harm:</h4>
                    <ul className="space-y-3">
                      {factorInfo.relatedHarms.map((harmId, hidx) => {
                        const harm = illegalHarms.find(h => h.id === harmId);
                        return (
                          <li key={hidx} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-800 mr-3 flex-shrink-0">
                              {hidx + 1}
                            </span>
                            <div>
                              <p className="font-medium">{harm?.name || harmId}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No risk factors identified.</p>
          )}
        </div>
        
        {/* Note for candidates */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold">Task for candidates:</p>
          <p>Implement the logic to filter risk factors based on questionnaire answers:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Update the useEffect to process answers from localStorage</li>
            <li>Add support for the risk factors related to question 3</li>
            <li>Add support the fourth illegal harm 'Drugs and psychoactive substances'</li>
            <li>Filter risk factors based on the selected options from questions 1, 2, and 3</li>
            
          </ul>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/questionnaire')}
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Questionnaire
          </button>
          <button
            onClick={handleContinue}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Risk Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
