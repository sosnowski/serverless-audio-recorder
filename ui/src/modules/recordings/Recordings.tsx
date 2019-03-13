import React, { Component, Fragment, FormEvent } from 'react';
import styles from './Recordings.module.scss';
import Item from './item/Item';
import { getRecordings, updateRecording } from '../../core/recordings.repo';
import { Recording } from '../../core/recording';
import Prompt from '../../core/prompt/Prompt';

interface State {
    records: Partial<Recording>[];
    selectedRecord?: Partial<Recording>;
    isLoading: boolean;
    nameInput: string;
    error?: string;
    namePromptVisible: boolean;
}

export default class Recordings extends Component<{}, State> {

    state: State = {
        records: [],
        nameInput: '',
        isLoading: false,
        namePromptVisible: false
    };

    onNameInput = (event: FormEvent<HTMLInputElement>) => {
        this.setState({
            nameInput: event.currentTarget.value
        });
    }

    onItemEdit = (record: Partial<Recording>) => {
        this.setState({
            namePromptVisible: true,
            selectedRecord: record
        });
    }

    onItemRemove = (record: Partial<Recording>) => {

    }

    onEditConfirm = async () => {
        const newName = this.state.nameInput;
        if (!newName) {
            return;
        }
        this.setState({
            namePromptVisible: false,
            nameInput: ''
        });
        if (!this.state.selectedRecord) {
            return;
        }
        const newRecord: Partial<Recording> = Object.assign({}, this.state.selectedRecord, {
            title: newName
        });
        try {
            const results = await updateRecording(newRecord.id!, newRecord);
            this.setState({
                records: this.state.records.map((record) => {
                    return record.id === results.id ? results : record;
                })
            });
        } catch (e) {
            this.setState({
                error: e.message
            });
        }
    }

    onEditCancel = () => {
        this.setState({
            namePromptVisible: false,
            nameInput: ''
        });
    }

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
                        return <Item
                            key={recording.id}
                            record={recording}
                            onEdit={this.onItemEdit}
                            onRemove={this.onItemRemove}/>
                    })}
                </ul>)
            }
        </Fragment>);
    }
}