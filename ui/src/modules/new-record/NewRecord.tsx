import React, { Component } from 'react';
import styles from './NewRecord.module.scss';
import { AudioRecorder } from './audio-recorder';
import { RecordButton } from './record-button/RecordButton';
import { saveAudioFile } from '../../core/recordings.repo';

enum Messages {
    Ready = 'Hit the button to start recording',
    Pending = 'Recording...',
    Saving = 'Saving your recording...',
    Saved = 'Your record has been saved. Hit the button to record a new one.'
}

enum Errors {
    DeviceUnavailable = 'Unable to connect to the audio device!',
    SaveFailed = 'Unable to save your file!',
    RequestError = 'Failed server request!'
}

interface State {
    isRecording: boolean;
    error?: string;
    hint?: Messages;
    time?: number;
}

export default class NewRecord extends Component<{}, State> {

    state: State;
    audioRecorder?: AudioRecorder;
    timer?: NodeJS.Timeout;

    onStart = async () => {
        let stream: MediaStream;
        try {
            stream = await this.getMediaDevice();
        } catch (e) {
            this.setState({
                error: Errors.DeviceUnavailable
            });
            return;
        }
        this.audioRecorder = new AudioRecorder(stream!);
        this.audioRecorder.start();
        this.setState({
            isRecording: true,
            hint: Messages.Pending,
            error: undefined
        });
        this.timer = this.startCounter();
    }

    onStop = async () => {
        if (!this.audioRecorder || !this.audioRecorder.pending) {
            return;
        }
        const file = await this.audioRecorder.stop();
        this.setState({
            isRecording: false
        });
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.saveRecording(file);
    }

    constructor(props: any) {
        super(props);
        this.state = {
            isRecording: false,
            hint: Messages.Ready
        };
    }

    startCounter(): NodeJS.Timeout {
        let time = 0;
        this.setState({
            time: 0
        });
        return setInterval(() => {
            time += 1;
            this.setState({
                time: time
            });
            if (time > 60) {
                this.onStop();
            }
        }, 1000);
    }

    async getMediaDevice(): Promise<MediaStream> {
        return await navigator.mediaDevices.getUserMedia({ audio: true })
    }

    async saveRecording(file: File) {
        this.setState({
            hint: Messages.Saving
        });
        try {
            const result = await saveAudioFile(file);
            if (!result) {
                throw new Error(Errors.SaveFailed);
            }
            this.setState({
                hint: Messages.Saved
            });
        } catch (e) {
            this.setState({
                error: e.message
            });
        }
    }

    render() {
        return (
            <main className={styles.container}>
            { this.state.error ? (
                <section className={styles.error}>{this.state.error}</section>
            ) : (
                <section className={styles.hint}>{this.state.hint}</section>
            )}
            <section className={styles.record}>
                {
                    this.state.isRecording ? (<p className={styles.timer}>Time: {this.state.time} / 60 sec.</p>) : null
                }
                <RecordButton isRecording={this.state.isRecording} onStart={this.onStart} onStop={this.onStop}/>
            </section>
            </main>
        );
    }
}