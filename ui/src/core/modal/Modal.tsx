import React, { memo, Fragment, SFC } from 'react';
import styles from './Modal.module.scss';

interface Props {
    title?: string;
    visible: boolean;
    buttons?: string[];
    onButton?: (button: string) => void;
}

const Modal: SFC<Props> = memo((props) => {
    const onButtonClick = props.onButton || (() => {});
    return <div className={props.visible ? styles.visible : styles.hidden }>
        <div className={styles.glass}></div>
        <div className={styles.modal}>
            { props.title ? <header>{props.title}</header> : null }
            <section className={styles.content}>
                {props.children}
            </section>
            { props.buttons && props.buttons.length > 0 ? (
                <footer>
                    {props.buttons.map(button => <button key={button} onClick={() => onButtonClick(button)}>{button}</button>)}
                </footer>
            ): null }
        </div>
    </div>
});

export default Modal;