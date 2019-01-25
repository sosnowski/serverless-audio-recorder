import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.scss';

export class Header extends Component {

    render() {
        return (
            <header className={styles.container}>
                <NavLink exact to="/" className={styles.tab} activeClassName={styles.activeTab}>Record</NavLink>
                <NavLink to="/recordings" className={styles.tab} activeClassName={styles.activeTab}>Saved recordings</NavLink>
            </header>
        );
    }
}

