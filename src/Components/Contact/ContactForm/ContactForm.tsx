import React, { useEffect, useRef, useState } from 'react'
import styles from './ContactForm.module.css'

type FieldName = 'name' | 'email' | 'subject' | 'message'
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>
type Status = 'idle' | 'sending' | 'sent' | 'error'
type ControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

const EMPTY: Values = { name: '', email: '', subject: '', message: '' }
const MAX_MESSAGE = 1000
const TOPICS = [
    'Order or delivery',
    'Product question',
    'Returns and refunds',
    'Something else',
]

const validate = (v: Values): Errors => {
    const errors: Errors = {}
    if (v.name.trim().length < 2) errors.name = 'Enter your name.'
    if (!v.email.trim()) errors.email = 'Enter your email address.'
    else if (!/^\S+@\S+\.\S+$/.test(v.email)) errors.email = 'Enter a valid email, like name@example.com.'
    if (!v.subject) errors.subject = 'Choose what your message is about.'
    if (v.message.trim().length < 10) errors.message = 'Write at least 10 characters so we can help.'
    return errors
}

export default function ContactForm(): React.JSX.Element {
    const [values, setValues] = useState<Values>(EMPTY)
    const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
    const [status, setStatus] = useState<Status>('idle')
    const successRef = useRef<HTMLHeadingElement>(null)

    const errors = validate(values)
    const showError = (f: FieldName) => !!touched[f] && !!errors[f]
    const controlClass = (f: FieldName) =>
        `${styles.control} hagora-contact-control ${showError(f) ? styles.invalid : ''}`

    useEffect(() => {
        if (status === 'sent') successRef.current?.focus()
    }, [status])

    const handleChange = (e: React.ChangeEvent<ControlElement>) => {
        const { name, value } = e.target
        setValues((v) => ({ ...v, [name]: value }))
    }

    const handleBlur = (e: React.FocusEvent<ControlElement>) => {
        const name = e.target.name as FieldName
        setTouched((t) => ({ ...t, [name]: true }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setTouched({ name: true, email: true, subject: true, message: true })
        if (Object.keys(errors).length > 0) return

        setStatus('sending')
        try {
            // TODO: replace with your real request
            // await api.post('/contact', values)
            await new Promise((r) => setTimeout(r, 900))
            setStatus('sent')
        } catch {
            setStatus('error')
        }
    }

    const reset = () => {
        setValues(EMPTY)
        setTouched({})
        setStatus('idle')
    }

    if (status === 'sent') {
        return (
            <section className={`${styles.card} ${styles.success} hagora-contact-card`} role="status">
                <span className={styles.successIcon} aria-hidden="true">
                    <i className="fa-solid fa-check" />
                </span>

                <h3 ref={successRef} tabIndex={-1}>Message sent</h3>

                <p>
                    Thanks, {values.name.trim().split(' ')[0]}. We'll reply to{' '}
                    <strong>{values.email}</strong> within 24 hours.
                </p>

                <button type="button" className={`${styles.secondary} hagora-contact-secondary`} onClick={reset}>
                    Send another message
                </button>
            </section>
        )
    }

    return (
        <section className={`${styles.card} hagora-contact-card`} aria-labelledby="contact-form-title">
            <h3 id="contact-form-title" className={`${styles.title} hagora-contact-title`}>
                Send us a message
            </h3>
            <p className={`${styles.subtitle} hagora-contact-subtitle`}>
                Fill in the form and our team will get back to you.
            </p>

            <div aria-live="polite">
                {status === 'error' && (
                    <div role="alert" className={styles.alert}>
                        We couldn't send your message. Check your connection and try again.
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className={styles.field}>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                placeholder="Your name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={showError('name')}
                                aria-describedby={showError('name') ? 'name-error' : undefined}
                                className={controlClass('name')}
                            />
                            {showError('name') && <p id="name-error" className={styles.error}>{errors.name}</p>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className={styles.field}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="name@example.com"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={showError('email')}
                                aria-describedby={showError('email') ? 'email-error' : undefined}
                                className={controlClass('email')}
                            />
                            {showError('email') && <p id="email-error" className={styles.error}>{errors.email}</p>}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className={styles.field}>
                            <label htmlFor="subject">What's this about?</label>
                            <select
                                id="subject"
                                name="subject"
                                value={values.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={showError('subject')}
                                aria-describedby={showError('subject') ? 'subject-error' : undefined}
                                className={`${controlClass('subject')} ${styles.select} ${values.subject ? '' : styles.placeholder}`}
                            >
                                <option value="" disabled>Choose a topic</option>
                                {TOPICS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {showError('subject') && <p id="subject-error" className={styles.error}>{errors.subject}</p>}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className={styles.field}>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                maxLength={MAX_MESSAGE}
                                placeholder="Tell us how we can help..."
                                value={values.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={showError('message')}
                                aria-describedby={showError('message') ? 'message-error' : 'message-count'}
                                className={`${controlClass('message')} ${styles.textarea}`}
                            />
                            <div className={styles.meta}>
                                {showError('message')
                                    ? <p id="message-error" className={styles.error}>{errors.message}</p>
                                    : <span />}
                                <span id="message-count" className={styles.count}>
                                    {values.message.length}/{MAX_MESSAGE}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                            {status === 'sending'
                                ? <span className={styles.spinner} aria-hidden="true" />
                                : <i className="fa-regular fa-paper-plane" aria-hidden="true" />}
                            {status === 'sending' ? 'Sending...' : 'Send message'}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    )
}