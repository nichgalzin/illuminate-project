import { useState, useEffect, useCallback } from "react";
import {
  safetyMeasures,
  type SafetyMeasure,
  RiskLevels,
  QuestionnaireAnswers,
} from "../data/data";
import { useRouter } from "next/router";
import { getFromLocalStorage } from "../utils/getFromLocalStorage";
import Head from "next/head";

export default function RecommendedMeasures() {
  const router = useRouter();
  const [measures, setMeasures] = useState<SafetyMeasure[]>(safetyMeasures);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filterMeasures = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const riskLevels = getFromLocalStorage<RiskLevels>("riskLevels");
      const answers = getFromLocalStorage<QuestionnaireAnswers>(
        "questionnaireAnswers",
      );

      if (!riskLevels || !answers) {
        setError(
          "Required data is missing. Please complete the risk assessment first.",
        );
        setMeasures([]);
        return;
      }

      const isLargeService = answers.q3 && answers.q3[0] === "largeService";
      const highRiskCount = Object.values(riskLevels).filter(
        (level) => level === "High",
      ).length;

      const filteredMeasures = safetyMeasures.filter((measure) => {
        switch (measure.conditionType) {
          case "highRiskCount":
            return highRiskCount >= (measure.conditionData.minCount || 0);

          case "specificHarmHighRisk":
            return (
              measure.conditionData.harmId &&
              riskLevels[measure.conditionData.harmId] === "High"
            );

          case "largeServiceAndHighRisk":
            return (
              isLargeService &&
              measure.conditionData.harmId &&
              riskLevels[measure.conditionData.harmId] === "High"
            );

          default:
            return false;
        }
      });
      setMeasures(filteredMeasures);
    } catch (error) {
      setError("An error occurred while processing your risk assessment data.");
      setMeasures([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    filterMeasures();
  }, [filterMeasures]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Risk Assessment - Recommended Measures</title>
      </Head>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Recommended Safety Measures
        </h1>
        <p className="mb-6 text-gray-600">
          Based on your risk assessment, we recommend implementing the following
          safety measures:
        </p>

        {isLoading && (
          <div className="text-center py-8">
            <p>Loading recommendations...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Please Start Again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4 mb-8">
            {measures.map((measure, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{measure.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {measure.reference}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Condition: {measure.condition}
                </p>
                <p className="mt-3">{measure.description}</p>
              </div>
            ))}

            {measures.length === 0 && (
              <p className="text-center py-8 text-gray-500">
                No measures recommended based on your risk profile.
              </p>
            )}
          </div>
        )}

        {/* Note for candidates */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="font-semibold">Task for candidates:</p>
          <p>Tasks 3 and 4:</p>
          <ul className="list-disc list-inside pl-4">
            <li>
              Task 3: Add the fifth safety measure (Private Messaging
              Safeguards) to the data.ts file
            </li>
            <li>
              Task 4: Implement logic to filter measures based on the
              conditions:
            </li>
            <ul className="list-disc list-inside pl-4 ml-4">
              <li>
                Consider risk factors from the Results page and risk levels from
                the Risk Assessment page
              </li>
              <li>
                For the "Large service" condition, use the answer to question 3
                (over 700k users)
              </li>
              <li>Only show safety measures where the condition is met</li>
            </ul>
          </ul>
        </div>

        <div className="flex">
          <button
            onClick={() => router.push("/risk-assessment")}
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Risk Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
