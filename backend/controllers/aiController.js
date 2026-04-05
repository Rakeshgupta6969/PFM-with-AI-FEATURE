import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

export const getAiInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const firstDayCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayPrevious = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. Fetch current month transactions
    const currentTxns = await Transaction.find({
      userId,
      date: { $gte: firstDayCurrent }
    });

    const totalCurrent = currentTxns.reduce((sum, t) => sum + t.amount, 0);

    // 2. Fetch previous month transactions
    const prevTxns = await Transaction.find({
      userId,
      date: { $gte: firstDayPrevious, $lte: lastDayPrevious }
    });

    const totalPrev = prevTxns.reduce((sum, t) => sum + t.amount, 0);

    // 3. Spending distribution calculations
    const catMap = {};
    currentTxns.forEach(t => {
      const cat = t.category[0] || 'Uncategorized';
      catMap[cat] = (catMap[cat] || 0) + t.amount;
    });

    const distribution = Object.entries(catMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      percentage: totalCurrent > 0 ? parseFloat(((value / totalCurrent) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.value - a.value);

    // 4. Comparison
    const diff = totalCurrent - totalPrev;
    const diffPercent = totalPrev > 0 ? (diff / totalPrev) * 100 : 0;
    const comparison = {
      totalCurrent: parseFloat(totalCurrent.toFixed(2)),
      totalPrev: parseFloat(totalPrev.toFixed(2)),
      diff: parseFloat(diff.toFixed(2)),
      diffPercent: parseFloat(diffPercent.toFixed(1)),
      trend: diff > 0 ? 'increase' : 'decrease'
    };

    // 5. Detect unusual spending (Simple outlier detection: 3x category average)
    // First get historical averages per category
    const historyRes = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$category" },
      { $group: { _id: "$category", avg: { $avg: "$amount" } } }
    ]);
    
    const avgMap = {};
    historyRes.forEach(r => avgMap[r._id] = r.avg);

    const unusual = currentTxns.filter(t => {
      const cat = t.category[0];
      const avg = avgMap[cat];
      return avg && t.amount > avg * 3; // 3x the typical spend in this category
    }).map(t => ({
      name: t.name,
      amount: t.amount,
      category: t.category[0],
      date: t.date,
      reason: `Spending is 3x higher than your typical ${t.category[0]} purchase.`
    }));

    // 6. Suggestions (Top 3 based)
    const suggestions = [];
    const top3 = distribution.slice(0, 3);
    
    top3.forEach(cat => {
      if (cat.name.includes('Food') || cat.name.includes('Drink')) {
        suggestions.push("Your restaurant spending is high. Consider meal prepping to save approx. $150 this month.");
      } else if (cat.name.includes('Travel') || cat.name.includes('Transport')) {
        suggestions.push("Commute costs detected. Compare ride-share vs public transit for potential 20% savings.");
      } else if (cat.name.includes('Shop') || cat.name.includes('Personal')) {
        suggestions.push("Impulse shopping detected. Try the '30-day wait' rule for non-essential purchases.");
      }
    });

    if (suggestions.length < 2) {
      suggestions.push("Automate a $50 recurring transfer to your savings account on payday.");
    }

    res.json({
      distribution,
      top3,
      comparison,
      unusual,
      suggestions: suggestions.slice(0, 3)
    });

  } catch (error) {
    console.error('AI Insight Error:', error);
    res.status(500).json({ message: error.message });
  }
};
