import React from 'react'
import OurCalendar from '@/components/OurCalendar'
import EventCountdown from '@/components/EventCountdown'
import styles from './page.module.css'

export default function page() {
    return (
        <main className={styles.main}>
            <OurCalendar />
            <EventCountdown/>
        </main>
    )
}