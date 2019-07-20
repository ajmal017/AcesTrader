// ShowSymbolCompanyDescription/index.js

import React from 'react'
import { getSymbolCompanyData } from '../../lib/appGetSymbolCompanyData'

export const showSymbolCompanyDescription = (symbol) => {
    // This component renders a button calling a modal to show the symbol's description

    const getModalContent = async () => {
        let content
        const data = getSymbolCompanyData([symbol])
        try {
            await data
            content = data.arr[0].data.description
        } catch (err) {
            content = `${symbol} company description not found. Error ${err.message}`
        }
        return content
    }

    const ToggleContent = ({ toggle, content }) => {
        const [isShown, setIsShown] = React.useState(false);
        let modalContent
        const hide = () => setIsShown(false);
        const show = async () => {
            modalContent = await getModalContent()
            setIsShown(true)
        }

        return (
            <>
                {toggle(show)}
                {isShown && content(hide)}
            </>
        );
    }

    const Modal = ({ children }) => (
        ReactDOM.createPortal(
            <div className="modal">
                {children}
            </div>,
            document.getElementById('modal-root')
        )
    )

    return (
        <>
            Click to reveal a secret:
            <ToggleContent toggle={(show) => { <button onClick={show}>Open</button> }} content={(hide) => {
                (
                    <Modal>
                        <div>modalContent</div> //TODO <***Content is not know when this is rendered
                        <button onClick={hide}>Close</button>
                    </Modal>
                )
            }} />
        </>
    )

}
