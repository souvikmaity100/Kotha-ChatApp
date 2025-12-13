export const formatMsgTime = (date) => {
  return new Date(date).toLocaleTimeString("en-In", {
    hour: "2-digit",
    minute: "2-digit"
  });
};
