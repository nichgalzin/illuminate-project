import { useEffect, useState } from "react";
import { riskFactors, illegalHarms, riskFactorDescriptions } from "../data/data";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Results() {
  const router = useRouter();
  const [riskList, setRiskList] = useState<string[]>([]);
  const [riskFactorList, setRiskFactorList] = useState<string[]>([]);
  const [isLargeService, setIsLargeService] = useState<boolean>(false);
  
  useEffect(() => {
    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem("questionnaireAnswers");
    if (savedAnswers) {
      try {
        const answers = JSON.parse(savedAnswers);
        
        // Initialize arrays to store identified risk factors and risks
        const identifiedRiskFactors: string[] = [];
        const identifiedRisks = new Set<string>();
        
        // Process Question 1 (service type)
        if (answers.q1) {
          answers.q1.forEach((serviceType: string) => {
            identifiedRiskFactors.push(serviceType);
            
            // Add associated illegal harms to the risk list
            if (riskFactors[serviceType]) {
              riskFactors[serviceType].forEach(risk => identifiedRisks.add(risk));
            }
          });
        }
        
        // Process Question 2 (features)
        if (answers.q2) {
          answers.q2.forEach((feature: string) => {
            identifiedRiskFactors.push(feature);
            
            // Add associated illegal harms to the risk list
            if (riskFactors[feature]) {
              riskFactors[feature].forEach(risk => identifiedRisks.add(risk));
            }
          });
        }
        
        // Process Question 3 (user count)
        if (answers.q3) {
          if (answers.q3.includes("largeService")) {
            setIsLargeService(true);
            
            // Add "largeService" as a risk factor
            identifiedRiskFactors.push("largeService");
            if (riskFactors["largeService"]) {
              riskFactors["largeService"].forEach(risk => identifiedRisks.add(risk));
            }
          }
        }
        
        // Update state with identified risk factors and risks
        setRiskFactorList(identifiedRiskFactors);
        setRiskList(Array.from(identifiedRisks));
        
      } catch (error) {
        console.error("Error parsing saved answers:", error);
      }
    }
  }, []);
  
  // Store the risks and risk factors in localStorage for the next step
  useEffect(() => {
    localStorage.setItem("calculatedRisks", JSON.stringify(riskList));
    localStorage.setItem("riskFactors", JSON.stringify(riskFactorList));
    localStorage.setItem("isLargeService", JSON.stringify(isLargeService));
  }, [riskList, riskFactorList, isLargeService]);

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
          <p>Task 2: Update the filtering logic to support your changes:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Ensure the filtering logic handles the fourth illegal harm 'Drugs and psychoactive substances' that you added in Task 1</li>
            <li>Make sure the new illegal harm appears under its linked risk factors on this page</li>
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
