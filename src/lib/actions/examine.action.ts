import { Action } from "../../core/action";
import { Entity } from "../../core/api";

export class ExamineAction extends Action {
    constructor(
        public actor: Entity,
        public target: string
    ) {
        super();
    }
}

export interface OnExamineAction {
    onExamineAction(action: ExamineAction): void;
}