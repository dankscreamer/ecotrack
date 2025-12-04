import { useMemo } from 'react';

const EcoNudge = ({ activities }) => {
    const nudge = useMemo(() => {
        if (!activities || activities.length === 0) {
            return { text: "Start logging activities to get personalized eco-tips!", color: "bg-blue-50 text-blue-700" };
        }

        const recent = activities[0];
        if (recent.type === 'Electricity' && recent.quantity > 10) {
            return { text: "High electricity usage detected. Try unplugging unused devices!", color: "bg-yellow-50 text-yellow-700" };
        }
        if (recent.type === 'Car Travel' && recent.quantity > 5) {
            return { text: "Consider carpooling or using public transport for your next trip.", color: "bg-orange-50 text-orange-700" };
        }
        if (recent.type === 'Streaming (Video)' && recent.quantity > 2) {
            return { text: "Did you know? Lowering video quality saves data and energy.", color: "bg-purple-50 text-purple-700" };
        }
        if (recent.emissionAmount < 0) {
            return { text: "Great job on saving emissions! Keep it up!", color: "bg-green-50 text-green-700" };
        }

        return { text: "Small steps make a big difference. Stay eco-conscious!", color: "bg-emerald-50 text-emerald-700" };
    }, [activities]);

    return (
        <div className={`rounded-lg p-4 ${nudge.color} border border-current opacity-80`}>
            <p className="font-medium">🌱 Eco Nudge</p>
            <p className="text-sm">{nudge.text}</p>
        </div>
    );
};

export default EcoNudge;
