import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styles from './App.module.scss';
import { Header } from './core/header/Header';

import NewRecord from './modules/new-record';
import Recordings from './modules/recordings';
import NotFound from './modules/not-found';

class App extends Component {

    // record = async () => {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia({
    //             audio: true
    //         });
    //         this.recorder = new AudioRecorder(stream);
    //         this.recorder.start();
    //     }
    //     catch (e) {
    //         console.error(e);
    //     }
    // }

    // stop = async () => {
    //     try {
    //         if (this.recorder) {
    //             const file = await this.recorder.stop();
    //             const data = new FormData();
    //             data.append('file', file);
    //             console.log(data);
    //             const urlResponse = await fetch('/upload-url?title=test&user=1');
    //             const uploadUrl = await urlResponse.json();
    //             console.log(`Upload file to: ${uploadUrl}`);
    //             const uploadResult = await fetch(uploadUrl, {
    //                 method: 'PUT',
    //                 body: data,
    //                 headers: {
    //                     'Content-Type': 'audio/ogg'
    //                 }
    //             });
    //         }
    //     }
    //     catch (e) {
    //         console.error(e);
    //     }
    // }

    render() {
        return (
            <Router>
                <div className={styles.container}>
                    <Header />
                    <Suspense fallback={<div>Loading</div>}>
                        <Switch>
                            <Route path="/" exact component={NewRecord} />
                            <Route path="/recordings" component={Recordings} />
                            <Route component={NotFound}/>
                        </Switch>
                    </Suspense>
                </div>
            </Router>
        );
    }
}

export default App;
