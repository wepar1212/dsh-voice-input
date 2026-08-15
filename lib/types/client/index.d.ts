/**
 * Composer voice input client half: a mic button in the input tool row that
 * transcribes speech into the draft via the browser Web Speech API. Listening
 * is continuous until the user clicks the button again to stop and commit.
 * @module @deepseek-ai/dsh-voice-input/client
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required client services. */
export declare const inject: string[];
/** Mount the mic button into the composer tool row and the live transcript pill. */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map