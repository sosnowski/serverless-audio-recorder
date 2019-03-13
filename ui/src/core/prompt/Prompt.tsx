import React, { SFC } from 'react';
import Modal from '../modal/Modal';

interface Props {
    visible: boolean;
    onYes: () => void;
    onNo: () => void;
}

const Prompt: SFC<Props> = (props) => {
    const onButtonClick = (button: string) => {
        if(button === 'Ok') {
            props.onYes();
        } else {
            props.onNo();
        }
    }
    return (<Modal visible={props.visible} buttons={['Ok', 'Cancel']} onButton={onButtonClick}>
        {props.children}
    </Modal>);
}

export default Prompt;