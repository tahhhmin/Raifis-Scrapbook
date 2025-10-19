import DaysCounter from "@/components/DaysCounter";
import styles from "./styles/page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <DaysCounter />
            <div className={styles.smth}>
                <p>something</p>
            </div>
        </main>
    );
}
