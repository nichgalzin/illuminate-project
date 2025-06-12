import { useState, useEffect } from "react";
import { illegalHarms } from "../data/data";
import { useRouter } from "next/router";
import Head from "next/head";

export default function RiskAssessment() {
  const router = useRouter();
  const [riskLevels, setRiskLevels] = useState<Record<string, string>>({});
  
  // Load saved risk levels from localStorage when the page loads
  useEffect(() => {
    const savedRiskLevels = localStorage.getItem("riskLevels");
    if (savedRiskLevels) {
      try {
        setRiskLevels(JSON.parse(savedRiskLevels));
      } catch (error) {
        console.error("Error parsing saved risk levels:", error);
      }
    }
  }, []);

  const handleChange = (harmId: string, level: string) => {
    setRiskLevels(prev => ({ ...prev, [harmId]: level }));
  };

  const handleSubmit = () => {
    // Validate that all harms have been assigned a risk level
    const allAssigned = illegalHarms.every(harm => riskLevels[harm.id]);
    
    if (!allAssigned) {
      alert("Please assign a risk level to all illegal harms before continuing.");
      return;
    }
    
    localStorage.setItem("riskLevels", JSON.stringify(riskLevels));
    router.push("/recommended-measures");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Risk Assessment - Risk Levels</title>
      </Head>
      
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Risk Level Assessment</h1>
        <p className="mb-6 text-gray-600">
          For each identified illegal harm, please assign a risk level based on your assessment of likelihood and impact.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {illegalHarms.map(harm => (
            <div key={harm.id} className="mb-6 pb-6 border-b last:border-b-0 last:pb-0 last:mb-0">
              <p className="font-semibold text-lg mb-3">{harm.name}</p>
              <div className="flex flex-wrap gap-4">
                {["High", "Medium", "Low"].map(level => {
                  const isSelected = riskLevels[harm.id] === level;
                  const bgColor = {
                    High: isSelected ? "bg-red-100 border-red-500" : "bg-white border-gray-300",
                    Medium: isSelected ? "bg-yellow-100 border-yellow-500" : "bg-white border-gray-300",
                    Low: isSelected ? "bg-green-100 border-green-500" : "bg-white border-gray-300"
                  }[level];
                  
                  return (
                    <label 
                      key={level} 
                      className={`flex items-center px-4 py-2 rounded border ${bgColor} cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name={harm.id}
                        value={level}
                        checked={isSelected}
                        onChange={() => handleChange(harm.id, level)}
                        className="mr-2"
                      />
                      {level}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Note for candidates */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold">Task for candidates:</p>
          <p>Task 1: Add the fourth illegal harm:</p>
          <ul className="list-disc list-inside pl-4">
            <li>Add "Drugs and psychoactive substances" as a fourth illegal harm to assess</li>
            <li>Ensure the risk assessment interface allows users to assign risk levels to this new harm</li>
          </ul>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/results')}
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Results
          </button>
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={Object.keys(riskLevels).length === 0}
          >
            Continue to Recommended Measures
          </button>
        </div>
      </div>
    </div>
  );
}
