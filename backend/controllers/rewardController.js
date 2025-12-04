const prisma = require('../lib/prisma');

exports.getRewards = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { rewards: true },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            points: user.points,
            badges: user.rewards,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rewards', error: error.message });
    }
};
