export class AudioRecorder {

    private chunks: any[] = [];
    private recorder: MediaRecorder;
    private stopPromise: Promise<File>;

    get state() {
        return this.recorder.state;
    }

    get pending() {
        return this.recorder.state === 'recording';
    }
    constructor(private stream: MediaStream) {
        this.recorder = new MediaRecorder(stream);

        this.recorder.ondataavailable = (event: MediaRecorderDataAvailableEvent) => {
            this.chunks.push(event.data);
        }

        this.stopPromise = new Promise<File>((resolve, reject) => {
            this.recorder.onstop = () => {
                console.log('record stopped');
                const blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
                resolve(new File([blob], 'audio-record'));
            }
        });
    }

    start() {
        this.recorder.start();
    }

    resume() {
        this.recorder.resume();
    }

    stop(): Promise<File> {
        this.recorder.stop();
        return this.stopPromise;
    }
}