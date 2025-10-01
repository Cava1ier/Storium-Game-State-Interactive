import type { GrokCrud } from '../grokCrud';
import type { GameScaffold } from '../gameScaffold';

// --- BASE CRUD HANDLER ---
export class BaseCrudHandler {
    constructor(protected crud: GrokCrud, protected scaffold: GameScaffold) {}
}
