import { DateTime } from 'luxon';
import { Recording } from "./recording";

// const apiUrl = 'https://b7kdkbjbw6.execute-api.eu-west-1.amazonaws.com/Stage';
const apiUrl = '';

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
            created: DateTime.fromISO(record.created),
            getAudioUrl: record.getAudioUrl || undefined,
            deleteAudioURl: record.deleteAudioURl || undefined,
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
        created: DateTime.fromISO(record.created),
        getAudioUrl: record.getAudioUrl || undefined,
        deleteAudioURl: record.deleteAudioURl || undefined,
        id: record.recordId
    };
}

export const updateRecording = async (recordId: string, data: Partial<Recording>): Promise<Recording> => {
    const response = await fetch(`${apiUrl}/recordings/${recordId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed server request');
    }

    const record = await response.json();
    return {
        title: record.title,
        created: DateTime.fromISO(record.created),
        getAudioUrl: record.getAudioUrl || undefined,
        deleteAudioURl: record.deleteAudioURl || undefined,
        id: record.recordId
    }
}

export const deleteRecording = async (record: Recording): Promise<Recording> => {
    if (!record.deleteAudioURl) {
        throw new Error('Missing delete audio url!');
    }
    const response = await fetch(record.deleteAudioURl, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed server request!');
    }

    return record;
}