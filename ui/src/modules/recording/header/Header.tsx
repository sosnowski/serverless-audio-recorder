import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { Recording } from '../../../core/recording';
import styles from './Header.module.scss';

interface Props {
    record: Recording;
    onEdit: (record: Recording) => void;
    onRemove: (record: Recording) => void;
}

interface State {
    menuVisible: boolean;
}

export class Header extends Component<Props, State> {

    state = {
        menuVisible: false
    };

    onToggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible
        });
    }

    onEdit = () => {
        this.props.onEdit(this.props.record);
        this.hideMenu();
    }

    onRemove = () => {
        this.props.onRemove(this.props.record);
        this.hideMenu();
    }

    hideMenu() {
        this.setState({
            menuVisible: false
        });
    }

    render() {
        const h1Class = this.state.menuVisible ? `${styles.withMenu}` : ``;
        return (
            <header className={styles.header}>
                <h1 className={h1Class}>
                    <span className={styles.title}>{this.props.record.title}</span>
                    <i className={`fas fa-ellipsis-v ${styles.menuToggle}`} onClick={this.onToggleMenu}></i>
                    <span className={styles.menu}>
                        <i className="fas fa-pencil-alt" onClick={this.onEdit}></i>
                        <i className="fas fa-trash-alt" onClick={this.onRemove}></i>
                    </span>
                </h1>
                <p>{this.props.record.created.toLocaleString(DateTime.DATETIME_MED)}</p>
            </header>
        )
    }
}