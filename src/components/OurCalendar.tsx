"use client"

import React, { useEffect, useState } from "react";
import style from "./OurCalendar.module.css";

interface Note {
  _id: string;
  text: string;
  addedBy?: string;
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  notes: Note[];
  addedBy?: string;
  repeat?: "none" | "monthly" | "yearly";
  isMilestone?: boolean;
}

export default function OurCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newRepeat, setNewRepeat] = useState<"none" | "monthly" | "yearly">("none");
  const [newMilestone, setNewMilestone] = useState(false);
  const [noteText, setNoteText] = useState<{ [key: string]: string }>({});

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editRepeat, setEditRepeat] = useState<"none" | "monthly" | "yearly">("none");
  const [editMilestone, setEditMilestone] = useState(false);

  // Fetch events from backend
  const fetchEvents = async () => {
    const res = await fetch("/api/calendar/getEvents");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add new event
  const handleAddEvent = async () => {
    if (!newTitle || !newDate) return;

    console.log({ newTitle, newDate, newRepeat, newMilestone }); // Debug

    const res = await fetch("/api/calendar/addEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        date: newDate,
        addedBy: "Annafi",
        repeat: newRepeat,
        isMilestone: newMilestone,
      }),
    });
    const data = await res.json();
    setEvents([...events, data]);
    setNewTitle("");
    setNewDate("");
    setNewRepeat("none");
    setNewMilestone(false);
  };

  // Delete event
  const handleDeleteEvent = async (id: string) => {
    await fetch("/api/calendar/deleteEvent", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEvents(events.filter((e) => e._id !== id));
  };

  // Add note
  const handleAddNote = async (eventId: string) => {
    const text = noteText[eventId];
    if (!text) return;

    const res = await fetch("/api/calendar/addEventNote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, text, addedBy: "Annafi" }),
    });
    const updatedEvent = await res.json();
    setEvents(events.map((e) => (e._id === eventId ? updatedEvent : e)));
    setNoteText({ ...noteText, [eventId]: "" });
  };

  // Edit event
  const handleEditEvent = async (id: string) => {
    const res = await fetch("/api/calendar/editEvent", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: editTitle,
        date: editDate,
        repeat: editRepeat,
        isMilestone: editMilestone,
      }),
    });
    const updatedEvent = await res.json();
    setEvents(events.map((e) => (e._id === id ? updatedEvent : e)));
    setEditingEventId(null);
  };

  return (
    <div className={style.calendarContainer}>
      <h2 className={style.title}>📅 Our Calendar</h2>

      {/* Add Event Form */}
      <div className={style.addEventForm}>
        <input
          type="text"
          placeholder="Event title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <select value={newRepeat} onChange={(e) => setNewRepeat(e.target.value as any)}>
          <option value="none">No Repeat</option>
          <option value="monthly">Repeat Monthly</option>
          <option value="yearly">Repeat Yearly</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={newMilestone}
            onChange={(e) => setNewMilestone(e.target.checked)}
          />
          Milestone
        </label>
        <button onClick={handleAddEvent}>Add Event</button>
      </div>

      {/* Events List */}
      <div className={style.eventsList}>
        {events.map((event) => (
          <div key={event._id} className={style.eventCard}>
            <div className={style.eventHeader}>
              {editingEventId === event._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                  <select value={editRepeat} onChange={(e) => setEditRepeat(e.target.value as any)}>
                    <option value="none">No Repeat</option>
                    <option value="monthly">Repeat Monthly</option>
                    <option value="yearly">Repeat Yearly</option>
                  </select>
                  <label>
                    <input
                      type="checkbox"
                      checked={editMilestone}
                      onChange={(e) => setEditMilestone(e.target.checked)}
                    />
                    Milestone
                  </label>
                  <button onClick={() => handleEditEvent(event._id)}>Save</button>
                  <button onClick={() => setEditingEventId(null)}>Cancel</button>
                  <button
                    className={style.deleteBtn}
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    ❌
                  </button>
                </>
              ) : (
                <>
                  <h3>
                    {event.title} {event.isMilestone ? "🏆" : ""}
                  </h3>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  {event.repeat && event.repeat !== "none" && <span> 🔁 {event.repeat}</span>}
                  <button
                    onClick={() => {
                      setEditingEventId(event._id);
                      setEditTitle(event.title);
                      setEditDate(event.date.split("T")[0]);
                      setEditRepeat(event.repeat || "none");
                      setEditMilestone(event.isMilestone || false);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={style.deleteBtn}
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    ❌
                  </button>
                </>
              )}
            </div>

            {/* Notes */}
            <div className={style.notes}>
              {event.notes.map((note) => (
                <div key={note._id} className={style.note}>
                  <strong>{note.addedBy || "Someone"}:</strong> {note.text}
                </div>
              ))}
            </div>

            {/* Add Note */}
            <div className={style.addNote}>
              <input
                type="text"
                placeholder="Add a note..."
                value={noteText[event._id] || ""}
                onChange={(e) =>
                  setNoteText({ ...noteText, [event._id]: e.target.value })
                }
              />
              <button onClick={() => handleAddNote(event._id)}>Add Note</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
