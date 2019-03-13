import React, { Component, createRef, RefObject } from 'react';
import styles from './Player.module.scss';

interface Props {
    audioSrc: string;
}

interface State {
    isPlaying: boolean;
    currentTime: number;
    totalTime: number;
}

export default class Player extends Component<Props, State> {

    onClickPlay = () => {
        if (this.audio.current) {
            this.audio.current.play();
        }
    }

    onClickStop = () => {
        if (this.audio.current) {
            this.audio.current.pause();
        }
    }

    onPlay = () => {
        this.setState({
            isPlaying: true
        });
    }

    onPause = () => {
        this.setState({
            isPlaying: false
        });
    }

    onEnded = () => {
        this.setState({
            isPlaying: false
        });
    }

    onTimeUpdate = () => {
        this.setState({
            currentTime: Math.floor(this.audio.current!.currentTime)
        });
    }

    onDurationChange = () => {
        this.setState({
            totalTime: Math.floor(this.audio.current!.duration)
        })
    }

    audio: RefObject<HTMLAudioElement>;

    constructor(props: Props) {
        super(props);
        this.state = {
            isPlaying: false,
            currentTime: 0,
            totalTime: 0
        };
        this.audio = createRef();
    }

    render() {
        return (
            <section className={styles.container}>
                <p>{this.state.currentTime} / {this.state.totalTime}</p>
                <i className="fas fa-backward fa-1x"></i>
                { !this.state.isPlaying ?
                    <i className={`fas fa-play-circle fa-4x ${styles.play}`} onClick={this.onClickPlay}></i> :
                    <i className={`fas fa-stop-circle fa-4x ${styles.stop}`} onClick={this.onClickStop}></i>
                }
                <i className="fas fa-forward fa-1x"></i>
                <audio ref={this.audio} src={this.props.audioSrc}
                    onEnded={this.onEnded}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                    onTimeUpdate={this.onTimeUpdate}
                    onDurationChange={this.onDurationChange}
                />
            </section>
        );
    }

}