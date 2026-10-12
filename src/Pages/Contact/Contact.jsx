import React from 'react'
import styles from './Contact.module.css'
import ContactHeader from '../../Components/Contact/ContactHeader/ContactHeader'
import ContactInfo from '../../Components/Contact/ContactInfo/ContactInfo'
import ContactForm from '../../Components/Contact/ContactForm/ContactForm'

export default function Contact() {
    return (
        <div className={styles.contact}>

            <ContactHeader />

            <div className="row g-5 align-items-start">

                <div className="col-lg-5">
                    <ContactInfo />
                </div>

                <div className="col-lg-7">
                    <ContactForm />
                </div>

            </div>

        </div>
    )
}