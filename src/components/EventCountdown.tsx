"use client";

import React, { useEffect, useState } from "react";
import styles from "./EventCountdown.module.css";

interface Event {
  _id: string;
  title: string;
  date: string; // original event date
  repeat?: "none" | "monthly" | "yearly";
  isMilestone?: boolean;
}

interface UpcomingEvent {
  _id: string;
  title: string;
  nextDate: Date;
  daysLeft: number;
}

export default function EventCountdown() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);

  const fetchEvents = async () => {
    const res = await fetch("/api/calendar/getEvents");
    const data: Event[] = await res.json();

    // Filter repeat events and calculate next occurrence
    const repeatEvents: UpcomingEvent[] = data
      .filter((e) => e.repeat && e.repeat !== "none")
      .map((e) => {
        const now = new Date();
        const eventDate = new Date(e.date); // ✅ const instead of let

        if (e.repeat === "monthly") {
          eventDate.setFullYear(now.getFullYear());
          eventDate.setMonth(now.getMonth());
          if (eventDate < now) eventDate.setMonth(now.getMonth() + 1);
        } else if (e.repeat === "yearly") {
          eventDate.setFullYear(now.getFullYear());
          if (eventDate < now) eventDate.setFullYear(now.getFullYear() + 1);
        }

        const daysLeft = Math.ceil(
          (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          _id: e._id,
          title: e.title,
          nextDate: eventDate,
          daysLeft,
        };
      })
      .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
      .slice(0, 10); // Show max 10

    setEvents(repeatEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (events.length === 0)
    return <div className={styles.container}>No repeat events found.</div>;

  return (
    <div className={styles.container}>
      <h2>⏳ Upcoming Repeat Events</h2>
      <ul className={styles.eventList}>
        {events.map((e) => (
          <li key={e._id} className={styles.eventCard}>
            <h3>{e.title}</h3>
            <p>
              Next on: {e.nextDate.toLocaleDateString()} ({e.daysLeft}{" "}
              {e.daysLeft === 1 ? "day" : "days"} left)
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
