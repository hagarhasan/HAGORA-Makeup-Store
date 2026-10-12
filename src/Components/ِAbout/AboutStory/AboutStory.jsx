import React from 'react'
import styles from './AboutStory.module.css'

export default function AboutStory() {
    return (
        <section className={styles.story}>

            <div className="row align-items-center g-5">

                <div className="col-lg-5">

                    <span className={styles.label}>
                        OUR STORY
                    </span>

                    <h2 className={styles.title}>
                        A beauty experience designed around you.
                    </h2>

                </div>

                <div className="col-lg-7">

                    <p className={styles.text}>
                        HAGORA was created with a simple idea:
                        shopping for beauty products should feel
                        inspiring, easy and enjoyable.
                    </p>

                    <p className={styles.text}>
                        From discovering new products to finding
                        your everyday essentials, HAGORA brings
                        everything together in a clean and elegant
                        experience designed for beauty lovers.
                    </p>

                </div>

            </div>

        </section>
    )
}