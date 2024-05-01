function Component() {
  const selectedDateMin3DaysDifference = () => {
    const diff = today.diff(selectedDate, "days");
    return diff > 3 || diff < -3;
  };
}