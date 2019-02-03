import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './Recordings.module.scss';

import { getRecordings } from '../../core/recordings.repo';
import { Recording } from '../../core/recording';

interface State {
    records: Partial<Recording>[];
    isLoading: boolean;
    error?: string;
}

export default class Recordings extends Component {

    state: State = {
        records: [],
        isLoading: false
    };

    async componentDidMount() {
        try {
            this.setState({
                isLoading: true
            });
            const files = await getRecordings();
            console.log(files);
            this.setState({
                records: files,
                isLoading: false
            });
        } catch (e) {
            this.setState({
                error: e.message
            });
        }
    }

    render() {
        return ( <Fragment>
            { this.state.error ? (
                    <div className={styles.error}>{this.state.error}</div>
            ) : null }
            { this.state.isLoading ? (<div className={styles.loader}>Loading...</div>) : (
                <ul className={styles.list}>
                    {this.state.records.map((recording) => {
                        return (<li key={recording.id}>
                            <Link to={`/recordings/${encodeURIComponent(recording.id!)}`}>{recording.title}</Link>
                        </li>)
                    })}
                </ul>)
            }
        </Fragment>);
    }
}