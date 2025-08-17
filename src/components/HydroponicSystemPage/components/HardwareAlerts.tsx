interface HardwareAlertProps {
  title: string;
  items: string[];
  color: "red" | "yellow";
}

const HardwareAlert: React.FC<HardwareAlertProps> = ({ title, items, color }) => {
  if (!items || items.length === 0) return null;

  const colorClasses = {
    red: "bg-red-50 border border-red-200 text-red-700",
    yellow: "bg-yellow-50 border border-yellow-200 text-yellow-700",
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <h4 className={`font-medium mb-2 ${color === "red" ? "text-red-900" : "text-yellow-900"}`}>
        {title}
      </h4>
      <ul className="text-sm space-y-1">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
};
export default HardwareAlert;