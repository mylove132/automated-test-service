import {Executor} from "../../config/base.enum";

export interface IRunCaseList {

    readonly caseListId: number;

    readonly envId: number;

    readonly executor: Executor;
}

export interface IRunCaseById {

    readonly caseIds: number[];

    readonly envId: number;

    readonly executor: Executor;
}
