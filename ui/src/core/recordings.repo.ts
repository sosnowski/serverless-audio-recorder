const getUploadUrl = async (): Promise<string> => {
    const response = await fetch('/upload-url');
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
            'Content-Type': 'audio/ogg'
        }
    });
    return uploadResponse.ok;
}