export function calculateDailyScore(data: {
  newSalesFoton: number;
  newSalesMahindra: number;
  resale: number;
  recoveryPercentage: number;
}) {
  const newSalesUnits = data.newSalesFoton + data.newSalesMahindra;
  const newSalesScore = Math.min(newSalesUnits * 3, 20); // max 20 points
  
  const resaleScore = Math.min(data.resale * 5, 30); // max 30 points
  const salesPerformanceScore = newSalesScore + resaleScore; // max 50 points
  
  const recoveryPerformanceScore = Math.min(data.recoveryPercentage * 0.4, 40); // max 40 points
  
  const mahindraBonusScore = Math.min(data.newSalesMahindra * 2, 10); // max 10 points
  
  const totalDailyScore = salesPerformanceScore + recoveryPerformanceScore + mahindraBonusScore;
  
  return {
    salesPerformanceScore,
    recoveryPerformanceScore,
    mahindraBonusScore,
    totalDailyScore
  };
}
