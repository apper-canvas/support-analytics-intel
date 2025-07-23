import Badge from "@/components/atoms/Badge";

const LogLevelBadge = ({ level, className }) => {
  const getVariant = (level) => {
    const levelLower = level?.toLowerCase();
    switch (levelLower) {
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Badge variant={getVariant(level)} className={className}>
      {level}
    </Badge>
  );
};

export default LogLevelBadge;