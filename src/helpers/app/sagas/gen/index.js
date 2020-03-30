import { fetch, fetchApp} from './fetch';
import {createAll, createApp} from './create';
import {deleting, deletingApp} from './remove';
import {updating, updatingApp} from './update';
import {clock, uploadModels} from './extra';
export const localApp = {
    fetch,
    createAll,
    deleting,
    updating
}
export const gApp = {
    fetchApp,
    createApp,
    deletingApp,
    updatingApp,
};

export const extra = {
    clock,
    uploadModels
}
