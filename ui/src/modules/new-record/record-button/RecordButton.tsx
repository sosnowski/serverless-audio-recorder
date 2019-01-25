import React, { Component } from 'react';
import styles from './RecordButton.module.scss';

interface RecordButtonProps {
    isRecording: boolean;
    onStart: () => void;
    onStop: () => void;
}

export const RecordButton = (props: RecordButtonProps) => {
    const buttonClasses = props.isRecording ? [ styles.button, styles.active ].join(' ') : styles.button;
    const handleClick = () => {
        if (props.isRecording) {
            props.onStop();
        } else {
            props.onStart();
        }
    }

    return (
        <button className={buttonClasses} onClick={handleClick}>
            {props.isRecording ? (
                <i className="fas fa-microphone-slash fa-5x"></i>
            ) : (
                <i className="fas fa-microphone fa-5x"></i>
            )}
        </button>
    );
};
