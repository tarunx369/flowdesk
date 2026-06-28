export const toDateKey = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().split("T")[0];
};

export const formatLongDate = (dateKey) => {
  const d = new Date(`${dateKey}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const addDays = (dateKey, amount) => {
  const d = new Date(`${dateKey}T00:00:00`);
  d.setDate(d.getDate() + amount);
  return toDateKey(d);
};

export const isToday = (dateKey) => dateKey === toDateKey(new Date());

export const formatTime12h = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

export const greeting = () => "Hello";
