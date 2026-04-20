import { useEffect, useState } from "react";

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const useDate = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const parts = today.split(" ");
    if (parts.length >= 3) {
      const [weekday, day, month] = parts;
      setDate(`${capitalize(weekday)} ${day} ${month}`);
      return;
    }

    setDate(capitalize(today));
  }, []);

  return { date };
};
