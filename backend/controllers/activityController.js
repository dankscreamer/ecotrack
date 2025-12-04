const prisma = require('../lib/prisma');

// Helper to get emission factor (mocked or from DB)
const getEmissionFactor = async (type) => {
  const factor = await prisma.emissionFactor.findUnique({
    where: { type },
  });
  return factor ? factor.factor : 0; // Default to 0 if not found
};

exports.getActivities = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes auth middleware sets req.user
    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

exports.addActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, quantity } = req.body;

    // Calculate emission
    let factor = await getEmissionFactor(type);

    // Fallback factors if DB is empty (for demo purposes)
    if (factor === 0) {
      const defaultFactors = {
        'Car Travel': 0.2, // kg CO2 per km
        'Electricity': 0.5, // kg CO2 per kWh
        'Flight': 0.15, // kg CO2 per km
        'Public Transport': 0.05, // kg CO2 per km
        'Walking': -0.1, // Saved CO2 per km (approx replacement of car)
        'Cycling': -0.1, // Saved CO2 per km (approx replacement of car)
        'Streaming (Video)': 0.036, // kg CO2 per hour
        'Internet Data': 0.01, // kg CO2 per GB (avg of 5-15g)
        'Gaming': 0.05, // kg CO2 per hour (estimated)
      };
      factor = defaultFactors[type] || 0;
    }

    const emissionAmount = quantity * factor;

    const activity = await prisma.activity.create({
      data: {
        userId,
        type,
        quantity: parseFloat(quantity),
        emissionAmount,
        date: new Date(),
      },
    });

    // Update user points (simple logic: 1 point per activity for now, or based on low emissions)
    // Let's say 10 points for logging an activity
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 10 } }
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error adding activity', error: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const activity = await prisma.activity.findUnique({ where: { id: parseInt(id) } });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.activity.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error: error.message });
  }
};
