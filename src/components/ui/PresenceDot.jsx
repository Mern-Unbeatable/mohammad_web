const PresenceDot = ({ online, className = "" }) => (
  <span
    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
      online ? "bg-green-primary" : "bg-[#D0D5DD]"
    } ${className}`.trim()}
    aria-label={online ? "Online" : "Offline"}
  />
);

export default PresenceDot;
