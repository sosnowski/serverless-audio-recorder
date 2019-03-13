import { DateTime } from "luxon";

export interface Recording {
    title: string;
    created: DateTime;
    getAudioUrl: string;
    deleteAudioURl: string;
    id: string;
}