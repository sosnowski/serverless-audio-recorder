import React, { Component, Fragment, FormEvent } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { DateTime } from 'luxon';
import styles from './Recording.module.scss';

import { getRecordingById, updateRecording, deleteRecording } from '../../core/recordings.repo';
import { Recording } from '../../core/recording';

import Player from './player/Player';
import { Header } from './header/Header';
import Prompt from '../../core/prompt/Prompt';

interface State {
    record?: Recording;
    isLoading: boolean;
    error?: string;
    nameInput?: string;
    editPromptVisible: boolean;
    removePromptVisible: boolean;
}

interface Props {
    recordId: string;
}

export default class RecordingComponent extends Component<RouteComponentProps<Props>, State> {

    state: State = {
        isLoading: false,
        editPromptVisible: false,
        removePromptVisible: false
    };

    onEdit = (record: Recording) => {
        this.setState({
            editPromptVisible: true
        });
    }

    onEditConfirm = async () => {
        const newName = this.state.nameInput;
        if (!newName || !this.state.record) {
            return;
        }
        this.setState({
            editPromptVisible: false,
            nameInput: ''
        });

        const newRecord: Partial<Recording> = Object.assign({}, this.state.record, {
            title: newName
        });
        try {
            const results = await updateRecording(newRecord.id!, newRecord);
            this.setState({
                record: results
            });
        } catch (e) {
            this.setState({
                error: e.message
            });
        }
    }

    onEditCancel = () => {
        this.setState({
            editPromptVisible: false,
            nameInput: ''
        });
    }

    onRemove = (record: Recording) => {
        this.setState({
            removePromptVisible: true
        });
    }

    onRemoveConfirm = async () => {
        this.setState({
            removePromptVisible: false
        });

        try {
            await deleteRecording(this.state.record!);
            //go to main page
        } catch (e) {
            this.setState({
                error: e.message
            });
        }
    }

    onRemoveCancel = () => {
        this.setState({
            removePromptVisible: false
        });
    }

    onNameInput = (event: FormEvent<HTMLInputElement>) => {
        this.setState({
            nameInput: event.currentTarget.value
        });
    }

    async componentDidMount() {
        try {
            const file = await getRecordingById(this.props.match.params.recordId);

            this.setState({
                record: file
            });

        } catch (e) {
            this.setState({
                error: e.message
            });
        }
    }

    render() {
        return (
            <Fragment>
                { this.state.isLoading ? <main className={styles.loader}>Loading...</main> : null }
                { this.state.error ? <main className={styles.error}>{this.state.error}</main> : null }
                { this.state.record ? (
                <main className={styles.container}>
                    <Header record={this.state.record} onEdit={this.onEdit} onRemove={this.onRemove} />
                    <Player audioSrc={this.state.record.getAudioUrl}/>
                </main>
                ) : null }

            <Prompt visible={this.state.editPromptVisible} onYes={this.onEditConfirm} onNo={this.onEditCancel}>
                <p>Enter new record name:</p>
                <input type="text" name="recordName" value={this.state.nameInput} className={styles.nameInput} onChange={this.onNameInput} />
            </Prompt>

            <Prompt visible={this.state.removePromptVisible} onYes={this.onRemoveConfirm} onNo={this.onRemoveCancel}>
                <p>Do you want to remove this recording?</p>
            </Prompt>
            </Fragment>
        )
    }
}