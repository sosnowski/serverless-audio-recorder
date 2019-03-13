import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hammer from 'react-hammerjs';
import styles from './Item.module.scss';
import { Recording } from '../../../core/recording';

interface State {
    menuVisible: boolean;
}

interface Props {
    record: Partial<Recording>;
    onEdit: (record: Partial<Recording>) => void;
    onRemove: (record: Partial<Recording>) => void;
}

export default class Item extends Component<Props, State> {

    onToggleMenu = () => {
        this.setState({
            menuVisible: !this.state.menuVisible
        });
    }

    onEdit = () => {
        this.props.onEdit(this.props.record);
        this.setState({
            menuVisible: false
        });
    }

    onRemove = () => {
        this.props.onRemove(this.props.record);
        this.setState({
            menuVisible: false
        });
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            menuVisible: false
        };
    }

    render() {
        const itemClass = this.state.menuVisible ? `${styles.item} ${styles.withMenu}` : styles.item;
        return (
                <li className={itemClass}>
                    { /* slow! */ }
                    <Link to={`/recordings/${encodeURIComponent(this.props.record.id!)}`}>{this.props.record.title}</Link>
                    <i className={`fas fa-ellipsis-v ${styles.menuToggle}`} onClick={this.onToggleMenu}></i>
                    <span className={styles.menu}>
                        <i className="fas fa-pencil-alt" onClick={this.onEdit}></i>
                        <i className="fas fa-trash-alt" onClick={this.onRemove}></i>
                    </span>
                </li>
        );
    }
}