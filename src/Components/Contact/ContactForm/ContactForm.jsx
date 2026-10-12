import React from 'react'
import styles from './ContactForm.module.css'

export default function ContactForm() {
    return (
        <section className={styles.formCard}>

            <div className={styles.formHeader}>

                <span>
                    SEND US A MESSAGE
                </span>

                <h3>
                    Let's start a conversation.
                </h3>

            </div>

            <form>

                <div className="row g-3">

                    <div className="col-md-6">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Your name"
                        />

                    </div>

                    <div className="col-md-6">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Your email"
                        />

                    </div>

                    <div className="col-12">

                        <label>
                            Subject
                        </label>

                        <input
                            type="text"
                            placeholder="What is this about?"
                        />

                    </div>

                    <div className="col-12">

                        <label>
                            Message
                        </label>

                        <textarea
                            rows="6"
                            placeholder="Tell us how we can help..."
                            className='w-100'
                        ></textarea>

                    </div>

                    <div className="col-12">

                        <button type="submit">
                            Send Message
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>

                    </div>

                </div>

            </form>

        </section>
    )
}

