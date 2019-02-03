import { Recording } from "./recording";

const apiUrl = 'https://b7kdkbjbw6.execute-api.eu-west-1.amazonaws.com/Stage';
// const apiUrl = '';

const getUploadUrl = async (): Promise<string> => {
    const response = await fetch(`${apiUrl}/upload-url`);
    if (!response.ok) {
        throw new Error('Failed server request');
    }
    const url = await response.json();
    if (!url) {
        throw new Error('Missing upload URL!');
    }
    return url;
}

export const saveAudioFile = async (file: File) => {
    const uploadUrl = await getUploadUrl();
    const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': 'audio/ogg; codecs=opus'
        }
    });
    return uploadResponse.ok;
}

export const getRecordings = async (): Promise<Recording[]> => {
    const response = await fetch(`${apiUrl}/recordings`);
    if (!response.ok) {
        throw new Error('Failed server request');
    }
    return (await response.json()).map((record: any): Recording => {
        return {
            title: record.title,
            created: new Date(record.created),
            audioUrl: record.audioUrl || undefined,
            id: record.recordId
        };
    })
};

export const getRecordingById = async (recordId: string): Promise<Recording> => {
    const response = await fetch(`${apiUrl}/recordings/${recordId}`);
    if (!response.ok) {
        throw new Error('Failed server request');
    }
    const record = await response.json();

    return {
        title: record.title,
        created: new Date(record.created),
        audioUrl: record.audioUrl || undefined,
        id: record.recordId
    };
}