import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'

interface LoginRequiredModalProps {
    onClose: () => void
}

export default function LoginRequiredModal({
    onClose
}: LoginRequiredModalProps) {
    const navigate = useNavigate()

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    function handleLogin() {
        onClose()
        navigate('/login')
    }

    const modalContent = (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                zIndex: 9999,
                backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-4 shadow-lg p-4 text-center"
                style={{
                    width: '90%',
                    maxWidth: '420px'
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <div
                    className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-circle"
                    style={{
                        width: '65px',
                        height: '65px',
                        backgroundColor: '#fce4ec',
                        color: '#c2185b'
                    }}
                >
                    <i className="fa-solid fa-lock fa-lg"></i>
                </div>

                <h4 className="fw-bold mb-2">
                    Login Required
                </h4>

                <p className="text-secondary mb-4">
                    Please log in to add products to your cart
                    and continue shopping.
                </p>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-light rounded-pill flex-grow-1 py-2"
                    >
                        Maybe Later
                    </button>

                    <button
                        type="button"
                        onClick={handleLogin}
                        className="btn text-white rounded-pill flex-grow-1 py-2 fw-semibold"
                        style={{
                            backgroundColor: '#c2185b'
                        }}
                    >
                        <i className="fa-solid fa-right-to-bracket me-2"></i>
                        Login
                    </button>
                </div>
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}