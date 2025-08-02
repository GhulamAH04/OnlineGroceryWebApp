
interface FeatureItemProps {
  icon: React.ReactNode; // Can be any valid React child (e.g., a component, an element).
  title: string;
  subtitle: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, subtitle }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default FeatureItem;