import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, className }) => {
  const getVariant = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "active":
        return "active";
      case "inactive":
        return "inactive";
      case "pending":
        return "pending";
      case "development":
        return "development";
      case "maintenance":
        return "maintenance";
      default:
        return "default";
    }
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  );
};

export default StatusBadge;