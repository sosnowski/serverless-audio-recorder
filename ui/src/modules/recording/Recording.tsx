import React, { Component, Fragment } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import styles from './Recording.module.scss';

import { getRecordingById } from '../../core/recordings.repo';
import { Recording } from '../../core/recording';

interface State {
    record?: Recording;
    isLoading: boolean;
    error?: string;
}

interface Props {
    recordId: string;
}

export default class Recordings extends Component<RouteComponentProps<Props>, State> {

    state: State = {
        isLoading: false
    };

    async componentDidMount() {
        try {
            const file = await getRecordingById(this.props.match.params.recordId);
            console.log(file);

            this.setState({
                record: file
            });

        } catch (e) {
            this.setState({
                error: e.message
            });
        }
        console.log(this.props);
    }

    render() {
        return (
            <Fragment>
                { this.state.isLoading ? <main className={styles.loader}>Loading...</main> : null }
                { this.state.error ? <main className={styles.error}>{this.state.error}</main> : null }
                { this.state.record ? (
                <main className={styles.container}>
                    <header className={styles.title}>
                        <h1>{this.state.record.title}</h1>
                        <p>{this.state.record.created.toISOString()}</p>
                    </header>
                    <audio className={styles.player} autoPlay preload="auto" src={this.state.record.audioUrl} controls></audio>
                </main>
                ) : null }
            </Fragment>
        )
    }
}