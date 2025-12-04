const prisma = require('../lib/prisma');

const getEmissionFactor = async (type) => {
  const factor = await prisma.emissionFactor.findUnique({
    where: { type },
  });
  return factor ? factor.factor : 0;
};

exports.getActivities = async (req, res) => {
  try {
    const userId = req.user.id;
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

    let factor = await getEmissionFactor(type);

    if (factor === 0) {
      const defaultFactors = {
        'Car Travel': 0.2,
        'Electricity': 0.5,
        'Flight': 0.15,
        'Public Transport': 0.05,
        'Walking': -0.1,
        'Cycling': -0.1,
        'Streaming (Video)': 0.036,
        'Internet Data': 0.01,
        'Gaming': 0.05,
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
